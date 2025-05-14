const express = require("express")
const {getTenants, getSingleTenant} = require("../controllers/tenants")
const {getAdministrators} = require("../controllers/administrators")
const {getTechnicians} = require("../controllers/technicians")

const router = express.Router()

//Routes
router.get("/tenants/all-tenants", getTenants)
router.get("/tenants/:id", getSingleTenant)
router.get("/administrators/all-administrators", getAdministrators)
router.get("/technicians/all-technicians", getTechnicians)

module.exports = router