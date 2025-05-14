const client = require("../config/db");

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

module.exports = { getTenants, getSingleTenant };
