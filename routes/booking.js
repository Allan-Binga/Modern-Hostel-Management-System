const express = require("express")
const {getBookings, bookARoom} = require("../controllers/booking")
const {authAdmin, authTenant} = require("../middleware/jwt")

const router = express.Router()

router.get("/all-bookings", authAdmin, getBookings)
router.post("/book-room", authTenant, bookARoom)

module.exports = router