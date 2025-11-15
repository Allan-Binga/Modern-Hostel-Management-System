const express = require("express");
const {
  handleStripeWebhook,
} = require("../controllers/webhook");

const router = express.Router();

//Stripe Webhooks Handling
router.post(
  "/",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

module.exports = router;
