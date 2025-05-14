const express = require("express")
const {getNotifications, getMyNotifications, readNotifications} = require("../controllers/notifications")
const {authAdmin, authTenant} = require("../middleware/jwt")

const router = express.Router()

router.get("/all-notifications", authAdmin, getNotifications)
router.get("/my-notifications", authTenant, getMyNotifications)
router.put("/my-notifications/:notificationId/mark-as-read", authTenant, readNotifications)

module.exports = router