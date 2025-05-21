const express = require("express");
const { getAllPayments, getUsersPayment } = require("../controllers/payments");
const { authAdmin, authTenant } = require("../middleware/jwt");

const router = express.Router();

//Routes
router.get("/all-payments", authAdmin, getAllPayments);
router.get("/my-payments", authTenant, getUsersPayment);

module.exports = router;
