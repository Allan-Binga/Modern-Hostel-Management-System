const express = require("express")
const {getRooms, createARoom, updateRoom} = require("../controllers/rooms")
const {uploadRoomPhoto} = require("../middleware/upload")
const {authAdmin} = require("../middleware/jwt")

const router = express.Router()

//Routes
router.get("/all-rooms", getRooms)
router.post("/create-a-room", uploadRoomPhoto.single('image'),authAdmin, createARoom)
router.put("/update-room/:id",uploadRoomPhoto.single('image'), authAdmin ,updateRoom)

module.exports = router