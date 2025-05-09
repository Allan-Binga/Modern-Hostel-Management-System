const express = require("express")
const {signUpTenant, signInTenant, signUpAdmin, signInAdmin} = require("../controllers/auth")

const router = express.Router()

//Tenant Routes
router.post("/tenant/sign-up", signUpTenant)
router.post("/tenant/sign-in", signInTenant)

//Admin Routes
router.post("/admin/sign-up", signUpAdmin)
router.post("/admin/sign-in", signInAdmin)

module.exports = router