const express = require("express")
const {getRooms, createARoom, updateRoom, deleteRoom} = require("../controllers/rooms")
const {uploadRoomPhoto} = require("../middleware/upload")
const {authAdmin} = require("../middleware/jwt")

const router = express.Router()

//Routes
router.get("/all-rooms", authAdmin, getRooms)
router.post("/create-a-room", uploadRoomPhoto.single('image'),authAdmin, createARoom)
router.patch("/update-room/:id",uploadRoomPhoto.single('image'), authAdmin ,updateRoom)
router.delete("/delete-room/:id", authAdmin, deleteRoom)

module.exports = router