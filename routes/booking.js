const express = require("express")
const {getBookings, bookARoom} = require("../controllers/booking")

const router = express.Router()

router.get("/all-bookings", getBookings)
router.post("/book-room", bookARoom)

module.exports = router