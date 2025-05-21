const express = require("express")
const {getBookings, bookARoom, usersBookings} = require("../controllers/booking")
const {authAdmin, authTenant} = require("../middleware/jwt")

const router = express.Router()

router.get("/all-bookings", authAdmin, getBookings)
router.get("/my-bookings" ,authTenant, usersBookings)
router.post("/book-room", authTenant, bookARoom)

module.exports = router