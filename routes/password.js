const express = require("express")
const {resetPasswordEmail, resetPasswordToken} = require("../controllers/password")

const router = express.Router()

router.post("/send-email", resetPasswordEmail)
router.put("/reset/password/token", resetPasswordToken)

module.exports = router