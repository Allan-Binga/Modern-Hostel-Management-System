const express = require("express")
const {verifyToken, resendVerificationEmail, verifyPasswordResetToken, resendPasswordResetEmail} = require("../controllers/emailService")

const router = express.Router()

router.get("/", verifyToken)
router.get("/password-token", verifyPasswordResetToken)
router.post("/resend/account-verification", resendVerificationEmail)
router.post("/resend/password-reset", resendPasswordResetEmail)

module.exports = router