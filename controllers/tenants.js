const client = require("../config/db");
const { createNotification } = require("./notifications");

//Get tenants
const getTenants = async (req, res) => {
  try {
    const tenants = await client.query("SELECT * FROM tenants");

    res.status(200).json(tenants.rows);
  } catch (error) {
    res.status(500).json("Could not fetch tenants.");
  }
};

// Get tenants by ID
const getSingleTenant = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch tenant details
    const tenantResult = await client.query(
      "SELECT * FROM tenants WHERE id = $1",
      [id]
    );

    if (tenantResult.rows.length === 0) {
      return res.status(404).json({ message: "Tenant not found." });
    }

    const {
      password,
      verificationtoken,
      verificationtokenexpiry,
      passwordresettoken,
      passwordresettokenexpiry,
      ...tenant
    } = tenantResult.rows[0]; // Destructure and exclude sensitive fields

    // Fetch Booking Details (including room_id)
    const bookingResult = await client.query(
      "SELECT * FROM bookings WHERE tenant_id = $1",
      [id]
    );

    const bookings = bookingResult.rows;

    // Fetch Room Details only if bookings exist
    let room = null;
    let roomPrice = null;

    if (bookings.length > 0) {
      const roomId = bookings[0]?.room_id;
      const roomResult = await client.query(
        "SELECT * FROM rooms WHERE roomid = $1",
        [roomId]
      );

      room = roomResult.rows.length > 0 ? roomResult.rows[0] : null;
      roomPrice = room ? room.price : null;
    }

    // Fetch Issue Report Details
    const issueReportResult = await client.query(
      `SELECT status, reported_date FROM issues WHERE tenant_id = $1 ORDER BY reported_date DESC LIMIT 1`,
      [id]
    );

    const latestIssue =
      issueReportResult.rows.length > 0 ? issueReportResult.rows[0] : null;

    // Return combined response without sensitive data
    res.status(200).json({
      tenant,
      bookings,
      room,
      latestIssue,
      roomPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not fetch tenant details." });
  }
};

//Update Tenant Informtion
const updateInformation = async (req, res) => {
  const tenantId = req.params.id;
  const { firstName, lastName, email, phone } = req.body;

  try {
    // Check if tenant exists
    const checkQuery = "SELECT * FROM tenants WHERE id = $1";
    const checkResult = await client.query(checkQuery, [tenantId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: "Tenant not found." });
    }

    const fields = [];
    const values = [];
    let counter = 1;

    if (firstName) {
      fields.push(`firstname = $${counter++}`);
      values.push(firstName);
    }

    if (lastName) {
      fields.push(`lastname = $${counter++}`);
      values.push(lastName);
    }

    if (email) {
      fields.push(`email = $${counter++}`);
      values.push(email);
    }

    if (phone) {
      fields.push(`phonenumber = $${counter++}`);
      values.push(phone);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No data provided for update." });
    }

    const updateQuery = `
      UPDATE tenants 
      SET ${fields.join(", ")}
      WHERE id = $${counter}
      RETURNING *;
    `;
    values.push(tenantId);

    const updateResult = await client.query(updateQuery, values);

    res.status(200).json({
      message: "Tenant information updated successfully.",
      tenant: updateResult.rows[0],
    });

    await createNotification(
      tenantId,
      "You recently updated your information."
    );
  } catch (error) {
    console.error("Update Tenant Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

//Delete tenant from the system
const deleteTenant = async (req, res) => {
  const tenantId = req.params.id;

  try {
    const result = await client.query("DELETE FROM tenants WHERE id = $1", [
      tenantId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Tenant not found." });
    }

    res.status(200).json({ message: "Tenant deleted successfully." });
  } catch (error) {
    console.error("Delete Tenant Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  getTenants,
  getSingleTenant,
  updateInformation,
  deleteTenant,
};
