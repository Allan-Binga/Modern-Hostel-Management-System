const express = require("express")
const {getAdvertisements, postAdvertisement, approveAdvertisement, rejectAdvertisement, getUsersAdvertisement, deleteAdvertisement} = require("../controllers/adverts")
const {authTenant, authAdmin} = require("../middleware/jwt")

const router = express.Router()

router.get("/all", getAdvertisements)
router.get("/my-advertisements", authTenant, getUsersAdvertisement)
router.post("/post-advertisement", authTenant, postAdvertisement)
router.put("/approve/:adId", authAdmin, approveAdvertisement)
router.put("/reject/:adId", authAdmin, rejectAdvertisement)
router.delete("/delete/:adId", deleteAdvertisement)

module.exports = router