const express = require("express")
const {getRooms} = require("../controllers/rooms")

const router = express.Router()

//Routes
router.get("/all-rooms", getRooms)

module.exports = router