const express = require("express")
const {signUpTenant, signInTenant, logoutTenant, signUpAdmin, signInAdmin, logoutAdmin} = require("../controllers/auth")

const router = express.Router()

//Tenant Routes
router.post("/tenant/sign-up", signUpTenant)
router.post("/tenant/sign-in", signInTenant)
router.post("/tenant/sign-out", logoutTenant)

//Admin Routes
router.post("/administrator/sign-up", signUpAdmin)
router.post("/administrator/sign-in", signInAdmin)
router.post("/administrator/sign-out", logoutAdmin)

module.exports = router