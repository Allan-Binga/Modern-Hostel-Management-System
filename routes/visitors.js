const express = require("express")
const {getVisitors, signInVisitor, signOutVisitor} = require("../controllers/visitors")

const router = express.Router()

//Routes
router.get("/all-visitors", getVisitors)
router.post("/sign-in", signInVisitor)
router.post("/sign-out", signOutVisitor)

module.exports = router