const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

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
    console.error("Error registering URLs:", error.response?.data || error.message);
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

module.exports = { registerURLs, validatePayment, confirmPayment };
