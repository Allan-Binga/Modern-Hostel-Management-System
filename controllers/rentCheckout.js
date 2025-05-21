const client = require("../config/db");
const axios = require("axios");
const moment = require("moment");
const dotenv = require("dotenv");
const Stripe = require("stripe");
const { sendPaymentFailureEmail } = require("./emailService");

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//Create a Stripe checkout
const createStripeCheckoutSession = async (req, res) => {
  const tenantId = req.tenantId;

  try {
    //Find tenant room number
    const tenantQuery = `SELECT room_id FROM bookings WHERE tenant_id = $1`;
    const tenantResult = await client.query(tenantQuery, [tenantId]);

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({ error: "Tenant not found." });
    }

    //Find Tenant's Email
    const emailQuery = `SELECT email FROM tenants WHERE id = $1`;
    const emailResult = await client.query(emailQuery, [tenantId]);

    if (emailResult.rows.length === 0) {
      return res.status(404).json({ error: "Email not found." });
    }

    const roomNumber = tenantResult.rows[0].room_id;
    const tenantEmail = emailResult.rows[0].email;

    //Get Rent Amount from Rooms Listings
    const rentQuery = `SELECT price, image FROM rooms WHERE roomid = $1`;
    const rentResult = await client.query(rentQuery, [roomNumber]);

    if (rentResult.rows.length === 0) {
      return res.status(404).json({ error: "Room not found." });
    }

    const { price: rentAmount, image: roomImage } = rentResult.rows[0];

    //Current Date
    const today = new Date().toISOString().split("T")[0];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoString = thirtyDaysAgo.toISOString().split("T")[0];

    //Check if any payment was made in the previous 30 days
    const paymentCheckQuery = `
      SELECT * FROM payments
      WHERE tenant_id = $1
        AND payment_date > $2
        AND payment_status = 'pending' 
    `;

    const paymentCheckResult = await client.query(paymentCheckQuery, [
      tenantId,
      thirtyDaysAgoString,
    ]);

    if (paymentCheckResult.rows.length > 0) {
      return res.status(400).json({
        error:
          "You have already paid rent within the last 30 days. Please try again later.",
      });
    }

    const insertPaymentQuery = `INSERT INTO payments (tenant_id, amount, payment_date, payment_method, payment_status) VALUES ($1, $2, $3, $4, $5) RETURNING payment_id`;

    const values = [tenantId, rentAmount, today, "Stripe", "Pending"];
    const result = await client.query(insertPaymentQuery, values);
    const paymentId = result.rows[0].payment_id;

    //Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "kes",
            product_data: {
              name: `Rent payment for <TenantName> for the month of <Month>`,
              images: roomImage ? [roomImage] : [],
            },
            unit_amount: rentAmount * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payments/success`,
      cancel_url: `${process.env.CLIENT_URL}/payments/failure`,
      metadata: {
        paymentId: paymentId.toString(),
        tenantId: tenantId.toString(),
        roomNumber: roomNumber.toString(),
      },
      payment_intent_data: {
        metadata: {
          paymentId: paymentId.toString(),
          tenantId: tenantId.toString(),
          roomNumber: roomNumber.toString(),
        },
      },
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating rent checkout session:", error.message);
    res
      .status(500)
      .json({ error: "Failed to create checkout session.", error });

    // await sendPaymentFailureEmail(tenantEmail)
  }
};

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
    console.log("Callback URL:", callbackUrl);

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

module.exports = {
  mpesaCheckout,
  createSTKPushNotification,
  createStripeCheckoutSession,
};
