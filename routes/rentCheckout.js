const express = require("express");
const { mpesaCheckout , createSTKPushNotification} = require("../controllers/rentCheckout");
const {authTenant} = require("../middleware/jwt")

const router = express.Router();

router.post("/pay-rent",authTenant, mpesaCheckout);
router.post("/pay-rent-stk", authTenant, createSTKPushNotification)

module.exports = router;
