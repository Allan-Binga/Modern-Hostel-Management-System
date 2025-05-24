const express = require("express")
const {getVisitors, signInVisitor, signOutVisitor, myVisitor} = require("../controllers/visitors")
const {authAdmin, authTenant} = require("../middleware/jwt")

const router = express.Router()

//Routes
router.get("/all-visitors", authAdmin, getVisitors)
router.post("/sign-in", signInVisitor)
router.post("/sign-out", signOutVisitor)
router.get("/my-visitors", authTenant, myVisitor)

module.exports = router