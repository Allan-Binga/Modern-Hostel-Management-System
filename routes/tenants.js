const express = require("express");
const { deleteTenant, updateInformation } = require("../controllers/tenants");
const {authTenant} = require("../middleware/jwt")

const router = express.Router();

router.put("/tenant/update/:id", authTenant,updateInformation)
router.delete("/tenant/delete/:id", authTenant, deleteTenant)

module.exports = router;
