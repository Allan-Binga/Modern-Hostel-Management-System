const axios = require("axios");
const dotenv = require("dotenv");
const client = require("../config/db");
const Stripe = require("stripe");

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//Handle Stripe WebHooks
const handleStripeWebhook = async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK;
  const sig = req.headers["stripe-signature"];
  const tenantId = req.tenantId;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return res.status(400).send("Webhook error.");
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const paymentId = session.metadata?.paymentId;
      const roomNumber = session.metadata?.roomNumber;

      try {
        if (!paymentId) {
          throw new Error("Payment ID not found in session metadata.");
        }
        if (!roomNumber) {
          throw new Error("Room Number not found in session's metadata.");
        }

        //Fetch tenant details
        const tenantQuery = `SELECT firstname, lastname, email FROM tenants WHERE id = $1`;
        const tenantResult = await client.query(tenantQuery, [tenantId]);

        if (tenantResult.rows.length === 0) {
          throw new Error("Tenant not found.");
        }

        //Fetch tenant's room id
        const roomIdQuery = `SELECT room_id FROM bookings WHERE tenant_id = $1`;
        const roomResult = await client.query(roomIdQuery, [tenantId]);

        if (roomResult.rows.length === 0) {
          throw new Error("Room not found.");
        }

        //Update Payment Status
        const updateQuery = `UPDATE payments SET payment_status = $1 WHERE payment_id = $2`;
        await client.query(updateQuery, ["Paid", paymentId]);
        console.log(`Payment ${paymentId} marked as paid.`);

        const {
          firstname,
          lastname,
          roomNumber: fetchedRoomNumber,
          email: tenantEmail,
        } = tenantResult.rows[0];
        const fullName = `${firstname} ${lastname}`;

        // Get the current date for payment date
        const paymentDate = new Date().toISOString().split("T")[0];
        return res.status(200).send("Webhook received and processed.");
      } catch (error) {
        console.error("Error processing webhook:", error.message);
        return res.status(500).send("Internal server error.");
      }

    case "payment_intent.payment_failed":
      const failedIntent = event.data.object;
      const failedPaymentId = failedIntent.metadata?.paymentId;

      try {
        if (failedPaymentId) {
          const updateQuery = `UPDATE payments SET payment_status = $1 WHERE payment_id = $2`;
          await client.query(updateQuery, ["Failed", failedPaymentId]);
          console.log(`Payment ${failedPaymentId} marked as failed`);
        }
        return res.status(200).send("Webhook received and processes.");
      } catch (error) {
        console.error("Failed to mark payment as failed:", error.message);
        return res.status(500).send("Internal server error.");
      }

    default:
      console.log(`Unhandled event type: ${event.type}`);
      return res.status(200).send("Webhook received.");
  }
};

// M-PESA Callback URL handling
const handleCallback = async (req, res) => {
  try {
    const callback = req.body.stkCallback;
    const { MerchantRequestID, ResultCode, ResultDesc } = callback;

    if (ResultCode === 0) {
      const metadata = callback.CallbackMetadata?.Item || [];

      const amount = metadata.find((item) => item.Name === "Amount")?.Value;
      const phone = metadata.find((item) => item.Name === "PhoneNumber")?.Value;

      const findTenantQuery = `SELECT id FROM tenants WHERE phonenumber = $1`;
      const tenantResult = await client.query(findTenantQuery, [phone]);

      if (tenantResult.rows.length === 0) {
        console.error("🚫 No tenant found with phone number:", phone);
        return res.status(404).json({ message: "Tenant not found." });
      }

      const tenantId = tenantResult.rows[0].id;

      const insertQuery = `
        INSERT INTO payments (tenant_id, amount, payment_date, mpesa_number, transaction_id, payment_status)
        VALUES ($1, $2, CURRENT_DATE, $3, $4, 'Completed')
      `;

      await client.query(insertQuery, [
        tenantId,
        amount,
        phone,
        MerchantRequestID,
      ]);
      console.log("✅ Payment successfully recorded.");

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Payment processed successfully",
      });
    } else {
      console.error("🚫 Payment failed:", ResultDesc);
      return res.status(400).json({
        ResultCode: 1,
        ResultDesc: "Payment failed",
      });
    }
  } catch (error) {
    console.error("Error in callback:", error);
    res.status(500).json({
      ResultCode: 1,
      ResultDesc: "Internal server error",
    });
  }
};

// Register URL Function
const registerURLs = async (req, res) => {
  try {
    const auth = Buffer.from(
      `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`
    ).toString("base64");

    const tokenResponse = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;

    await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl",
      {
        ShortCode: process.env.SHORTCODE,
        ResponseType: "Completed",
        ConfirmationURL: process.env.CONFIRMATION_URL,
        ValidationURL: process.env.VALIDATION_URL,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    res.status(200).json({ message: "URLs registered successfully" });
  } catch (error) {
    console.error(
      "Error registering URLs:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Failed to register URLs" });
  }
};

// Validation URL Handler
const validatePayment = async (req, res) => {
  try {
    console.log("Validation request received:", req.body);

    // Perform your validation logic here (e.g., check if account exists)
    const { BillRefNumber, TransAmount } = req.body;

    if (BillRefNumber && TransAmount > 0) {
      res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    } else {
      res.status(400).json({
        ResultCode: 1,
        ResultDesc: "Rejected - Invalid details",
      });
    }
  } catch (error) {
    console.error("Validation error:", error);
    res.status(500).json({
      ResultCode: 1,
      ResultDesc: "Error in validation",
    });
  }
};

// Confirmation URL Handler
const confirmPayment = async (req, res) => {
  try {
    console.log("Confirmation request received:", req.body);

    // Save transaction details to your database
    const { TransID, TransAmount, MSISDN } = req.body;
    // Example: Save transaction details in database
    // await client.query("INSERT INTO transactions ...", [TransID, TransAmount, MSISDN]);

    res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Confirmation received",
    });
  } catch (error) {
    console.error("Confirmation error:", error);
    res.status(500).json({
      ResultCode: 1,
      ResultDesc: "Error in confirmation",
    });
  }
};

module.exports = {
  registerURLs,
  validatePayment,
  confirmPayment,
  handleCallback,
  handleStripeWebhook,
};
