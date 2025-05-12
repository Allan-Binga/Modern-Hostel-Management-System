const express = require("express");
const {
  getAllIsues,
  reportIssue,
  resolveIssue,
} = require("../controllers/issueReport");
const { authTenant, authAdmin } = require("../middleware/jwt");

const router = express.Router();

//Routes
router.get("/all-issues", authAdmin, getAllIsues);
router.post("/report-issue", authTenant, reportIssue);
router.put("/resolve-issue/:issueId", authTenant, resolveIssue);

module.exports = router;
