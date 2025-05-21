const client = require("../config/db");
const {
  sendIssueReportEmail,
  technicianAssignmentEmail,
  sendIssueSubmissionEmailAdmin,
} = require("./emailService");
const { createNotification } = require("./notifications");

//Get All Issues
const getAllIsues = async (req, res) => {
  try {
    const issues = await client.query("SELECT * FROM issues");
    res.status(200).json(issues.rows);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch issues." });
  }
};

//Get My Requests
const getMyReportIssues = async (req, res) => {
  try {
    const tenantId = req.tenantId;

    const query = `
    SELECT * FROM issues
    WHERE tenant_id = $1
    ORDER BY reported_date DESC;
    `;

    const result = await client.query(query, [tenantId]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching your issue reports.");
    res.status(500).json({ message: "Failed to fetch your issue reports." });
  }
};

// Report an issue
const reportIssue = async (req, res) => {
  try {
    const { issueDescription, category, priority } = req.body;
    const tenantId = req.tenantId; // tenantId from middleware

    // Validate required fields
    if (!issueDescription || !category || !priority) {
      return res.status(400).json({
        error:
          "Missing required fields: Issue description, category, and priority are required",
      });
    }

    // Validate priority (must be High, Medium, or Low)
    const validPriorities = ["HIGH", "MEDIUM", "LOW"];
    if (!validPriorities.includes(priority.toUpperCase())) {
      return res
        .status(400)
        .json({ error: "Invalid priority. Must be HIGH, MEDIUM, or LOW" });
    }

    // Set default values for the issue
    const reported_date = new Date(); // Current timestamp
    const status = "OPEN"; // Default status for a new issue

    // Retrieve tenant email using tenantId
    const emailQuery = `SELECT email FROM tenants WHERE id = $1;`;
    const emailResult = await client.query(emailQuery, [tenantId]);

    if (emailResult.rows.length === 0) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const email = emailResult.rows[0].email;

    // Insert the issue into the database without assigning a technician
    const query = `
        INSERT INTO issues (tenant_id, issue_description, category, priority, reported_date, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING issue_id;
      `;
    const values = [
      tenantId,
      issueDescription,
      category,
      priority.toUpperCase(),
      reported_date,
      status,
    ];

    const result = await client.query(query, values);

    // Retrieve admin email
    const adminQuery = `SELECT email FROM admins LIMIT 1;`;
    const adminResult = await client.query(adminQuery);

    if (adminResult.rows.length === 0) {
      return res.status(400).json({ error: "Administrator not found." });
    }

    const adminEmail = adminResult.rows[0].email;
    // w

    // Send the issue report email
    await sendIssueReportEmail(email, category);

    await sendIssueSubmissionEmailAdmin(adminEmail, category, tenantId);

    // Return success response with the new issue_id
    return res.status(201).json({
      message: "Issue reported successfully",
      issue_id: result.rows[0].issue_id,
    });
  } catch (error) {
    // Handle errors
    console.error("Error reporting issue:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//Assign a technician
const assignTechnician = async (req, res) => {
  try {
    const { issueId } = req.body;

    // Validate required field
    if (!issueId) {
      return res.status(400).json({ error: "Issue ID is required." });
    }

    // Get issue details
    const issueQuery = "SELECT * FROM issues WHERE issue_id = $1";
    const issueResult = await client.query(issueQuery, [issueId]);

    if (issueResult.rows.length === 0) {
      return res.status(404).json({ error: "Issue not found." });
    }

    const issue = issueResult.rows[0];

    // Find a technician with matching specialty
    const technicianQuery =
      "SELECT * FROM technicians WHERE specialty = $1 AND assignment_status = 'Unassigned' LIMIT 1";
    const technicianResult = await client.query(technicianQuery, [
      issue.category,
    ]);

    if (technicianResult.rows.length === 0) {
      return res.status(404).json({
        error: "No available technician with the required specialty.",
      });
    }

    const technician = technicianResult.rows[0];

    // Assign the technician to the issue
    await client.query(
      "UPDATE technicians SET assignment_status = 'Assigned' WHERE technician_id = $1",
      [technician.technician_id]
    );

    await client.query(
      "UPDATE technicians SET assignment_status = 'Assigned' WHERE technician_id = $1",
      [technician.technician_id]
    );

    // Get tenant's email
    const tenantQuery = "SELECT email FROM tenants WHERE id = $1";
    const tenantResult = await client.query(tenantQuery, [issue.tenant_id]);

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({ error: "Tenant not found." });
    }

    const tenantEmail = tenantResult.rows[0].email;

    //Technician Assignment Email
    await technicianAssignmentEmail(
      tenantEmail,
      technician.name,
      technician.phone_number,
      issue.category
    );

    //Notification Creation
    // await createNotification(tenantId, )

    return res.status(200).json({
      message: "Technician assigned successfully.",
      technician: technician.name,
      issueId,
    });
  } catch (error) {
    console.error("Error assigning technician:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

//Resolve Issue
const resolveIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    const tenantId = req.tenantId;

    // Validate required field
    if (!issueId) {
      return res.status(400).json({
        error: "Issue ID is required in the URL parameters.",
      });
    }

    // Check if the issue exists and belongs to the tenant
    const issueQuery = `
      SELECT * FROM issues 
      WHERE issue_id = $1 AND tenant_id = $2;
    `;
    const issueResult = await client.query(issueQuery, [issueId, tenantId]);

    if (issueResult.rows.length === 0) {
      return res.status(404).json({
        error:
          "Issue not found or you do not have permission to resolve this issue",
      });
    }

    const issue = issueResult.rows[0];

    // Ensure the issue is not already resolved
    if (issue.status === "RESOLVED") {
      return res.status(400).json({
        error: "This issue is already resolved",
      });
    }

    // Update the issue status to 'RESOLVED' and set resolved_date
    const resolveDate = new Date();
    const updateQuery = `
      UPDATE issues 
      SET status = 'RESOLVED', resolved_date = $1 
      WHERE issue_id = $2 
      RETURNING issue_id, status, resolved_date;
    `;
    const updateResult = await client.query(updateQuery, [
      resolveDate,
      issueId,
    ]);

    //Create resolution notification
    await createNotification(
      tenantId,
      "Thank you, your recent issue report was resolved."
    );

    // Return success response with the updated issue information
    return res.status(200).json({
      message: "Issue resolved successfully",
      issue_id: updateResult.rows[0].issue_id,
      status: updateResult.rows[0].status,
      resolved_date: updateResult.rows[0].resolved_date,
    });
  } catch (error) {
    // Handle errors
    console.error("Error resolving issue:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllIsues,
  getMyReportIssues,
  reportIssue,
  resolveIssue,
  assignTechnician,
};
