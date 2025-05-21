const express = require("express");
const { mpesaCheckout , createSTKPushNotification, createStripeCheckoutSession} = require("../controllers/rentCheckout");
const {authTenant} = require("../middleware/jwt")

const router = express.Router();

router.post("/pay-rent",authTenant, mpesaCheckout);
router.post("/pay-rent-stk", authTenant, createSTKPushNotification)
router.post("/pay-rent-via-stripe", authTenant, createStripeCheckoutSession)

module.exports = router;
