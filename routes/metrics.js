const express = require("express")
const { getMetrics } = require("../controllers/metrics")

const router = express.Router()

router.get("/", getMetrics)

module.exports = router