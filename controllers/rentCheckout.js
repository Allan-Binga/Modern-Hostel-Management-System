const client = require("../config/db");
const axios = require("axios");
const moment = require("moment");
const dotenv = require("dotenv");

dotenv.config();

//Generate QR for payments
const mpesaCheckout = async (req, res) => {
  try {
    const { roomId } = req.body;
    const tenantId = req.tenantId;

    if (!roomId) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    // Check tenant
    const tenant = await client.query("SELECT * FROM tenants WHERE id = $1", [
      tenantId,
    ]);
    if (tenant.rowCount === 0) {
      return res.status(404).json({ message: "Tenant does not exist." });
    }

    // Check room
    const room = await client.query(
      "SELECT * FROM rooms WHERE roomid = $1 AND status = 'Pending'",
      [roomId]
    );
    if (room.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Room not available or does not exist." });
    }

    const roomPrice = Math.floor(room.rows[0].price);
    console.log("Room Price:", roomPrice);

    // Access credentials
    const consumerKey = process.env.CONSUMER_KEY;
    const consumerSecret = process.env.CONSUMER_SECRET;
    const tillNumber = process.env.TILL_NUMBER || null;
    if (!tillNumber) {
      throw new Error("TILL_NUMBER not set in .env");
    }
    console.log("Till Number:", tillNumber);

    // Generate access token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
      "base64"
    );
    const tokenResponse = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;
    console.log("Access Token:", accessToken);

    // Generate Dynamic QR Code
    const url = "https://sandbox.safaricom.co.ke/mpesa/qrcode/v1/generate";
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const requestBody = {
      MerchantName: "Prestige Girls Hostel",
      RefNo: `Booking-${tenantId}-${timestamp}`,
      Amount: roomPrice,
      TrxCode: "BG", // Fixed: Use "BG" for Till numbers
      CPI: tillNumber,
      Size: "400",
    };

    console.log("Request Body:", JSON.stringify(requestBody, null, 2));

    const qrResponse = await axios.post(url, requestBody, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log("API Response:", qrResponse.data);

    // Generate booking
    const booking = await client.query(
      "INSERT INTO bookings (tenant_id, room_id, booking_date, payment_status, check_in_date, check_out_date) VALUES ($1, $2, NOW(), 'Unpaid', NOW(), NOW() + INTERVAL '2 MONTH') RETURNING *",
      [tenantId, roomId]
    );

    // Update room status
    await client.query(
      "UPDATE rooms SET status = 'Pending' WHERE roomid = $1",
      [roomId]
    );

    res.status(200).json({
      message: "QR code generated successfully. Payment is pending.",
      qrCode: qrResponse.data.QRCode,
      booking: booking.rows[0],
    });
  } catch (error) {
    const errorMessage = error.response?.data?.errorMessage || error.message;
    console.error("Error generating M-Pesa QR:", errorMessage);
    res.status(500).json({
      message: "Failed to generate M-Pesa QR code.",
      error: errorMessage,
    });
  }
};

//Send a Push Notification
const createSTKPushNotification = async (req, res) => {
  try {
    const { amount, phoneNumber } = req.body; // Get amount and phone number from request body
    if (!amount || !phoneNumber) {
      return res
        .status(400)
        .json({ message: "Amount and phone number are required" });
    }

    // Validate phone number format (must be 2547XXXXXXXX)
    if (!/^2547\d{8}$/.test(phoneNumber)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    const shortcode = process.env.SHORTCODE;
    console.log(shortcode);
    const passkey = process.env.PASSKEY;
    const consumerKey = process.env.CONSUMER_KEY;
    const consumerSecret = process.env.CONSUMER_SECRET;
    const callbackUrl = process.env.CALLBACK_URL;

    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString(
      "base64"
    );
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
      "base64"
    );

    // Get access token
    const tokenResponse = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;

    // STK Push request
    const stkPush = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: shortcode,
        PhoneNumber: phoneNumber,
        CallBackURL: callbackUrl,
        AccountReference: "Prestige Girls Hostel",
        TransactionDesc: "Rent Payment",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.status(200).json({
      message: "STK Push initiated",
      data: stkPush.data,
    });
  } catch (error) {
    const errorMessage = error.response?.data?.errorMessage || error.message;
    console.error("Error:", errorMessage);
    res.status(500).json({
      message: "Failed to initiate STK Push",
      error: errorMessage,
    });
  }
};

module.exports = { mpesaCheckout, createSTKPushNotification };
