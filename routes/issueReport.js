const express = require("express");
const {
  getAllIsues,
  reportIssue,
  assignTechnician,
  resolveIssue,
  getMyReportIssues,
} = require("../controllers/issueReport");
const { authTenant, authAdmin } = require("../middleware/jwt");

const router = express.Router();

//Routes
router.get("/all-issues", authAdmin, getAllIsues);
router.get("/my-report-issues", authTenant, getMyReportIssues);
router.post("/report-issue", authTenant, reportIssue);
router.put("/assign-technician", authAdmin, assignTechnician);
router.put("/resolve-issue/:issueId", authTenant, resolveIssue);

module.exports = router;
