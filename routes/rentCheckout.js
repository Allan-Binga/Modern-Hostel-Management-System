const express = require("express");
const { createStripeCheckoutSession } = require("../controllers/rentCheckout");
const { authTenant } = require("../middleware/jwt")

const router = express.Router();

router.post("/pay-rent-via-stripe", authTenant, createStripeCheckoutSession)

module.exports = router;
