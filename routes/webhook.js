const express = require("express");
const {
  registerURLs,
  validatePayment,
  confirmPayment,
} = require("../controllers/webhook");

const router = express.Router();

// Route to register URLs (should be done once)
router.post("/url-register", registerURLs);

// Route for M-Pesa validation (called by M-Pesa)
router.post("/payments/validation", validatePayment);

// Route for M-Pesa confirmation (called by M-Pesa)
router.post("/payments/confirmation", confirmPayment);

module.exports = router;
