const client = require("../config/db");

// Visit Tenant/Visitor Sign-In
const signInVisitor = async (req, res) => {
  const { name, phoneNumber, visitedRoomId, entryTime, plannedExitTime } =
    req.body;

  if (!name || !phoneNumber || !visitedRoomId || !plannedExitTime) {
    return res.status(400).json({
      message:
        "Name, phone number, planned exit time, and visited room are required.",
    });
  }

  try {
    // Check if the room exists and fetch its status
    const roomQuery = "SELECT * FROM rooms WHERE roomid = $1";
    const roomResult = await client.query(roomQuery, [visitedRoomId]);

    if (roomResult.rows.length === 0) {
      return res.status(404).json({ message: "Room not found." });
    }

    const room = roomResult.rows[0];

    // Normalize status
    const status = room.status?.trim().toLowerCase();

    // Reject visit if room is not occupied
    if (status === "available") {
      return res.status(403).json({
        message:
          "No tenant in this room. Please request for a room ID from the tenant.",
      });
    }

    // Prevent multiple active visits
    const activeVisitQuery = `
      SELECT * FROM visitors 
      WHERE phonenumber = $1 AND visitedroomid = $2 AND is_active = true
    `;
    const activeVisit = await client.query(activeVisitQuery, [
      phoneNumber,
      visitedRoomId,
    ]);

    if (activeVisit.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Visitor is already signed in for this room." });
    }

    // Validate Entry Time
    const finalEntryTime = entryTime ? new Date(entryTime) : new Date();
    const finalPlannedExitTime = new Date(
      `${new Date().toISOString().split("T")[0]}T${plannedExitTime}:00`
    );

    if (finalPlannedExitTime.getHours() > 19) {
      return res
        .status(400)
        .json({ message: "Exit time cannot be later than 7PM." });
    }

    if (finalPlannedExitTime < finalEntryTime) {
      return res
        .status(400)
        .json({ message: "Planned exit time cannot be before entry time." });
    }

    // Register visitor
    const registerVisitorQuery = `
      INSERT INTO visitors (name, phoneNumber, entryTime, plannedExitTime, visitedRoomId, is_active)
      VALUES ($1, $2, $3, $4, $5, true)
      RETURNING *;
    `;

    const newVisitor = await client.query(registerVisitorQuery, [
      name,
      phoneNumber,
      finalEntryTime,
      finalPlannedExitTime,
      visitedRoomId,
    ]);

    res.status(201).json({
      message: "Visitor entry registered successfully.",
      visitor: newVisitor.rows[0],
    });
  } catch (error) {
    console.error("Visitor Sign-in Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Visitor Sign-Out
const signOutVisitor = async (req, res) => {
  const { phoneNumber, actualExitTime } = req.body;

  if (!phoneNumber || !actualExitTime) {
    return res.status(400).json({
      message: "Phone number and actual exit time are required to sign out.",
    });
  }

  try {
    // Find active visitor by phone number
    const checkVisitorQuery = `
      SELECT * FROM visitors 
      WHERE phonenumber = $1 AND is_active = true
      ORDER BY entrytime DESC
      LIMIT 1;
    `;
    const visitorResult = await client.query(checkVisitorQuery, [phoneNumber]);

    if (visitorResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Active visit not found for this phone number." });
    }

    const visitor = visitorResult.rows[0];
    const { visitorid, entrytime, plannedexittime } = visitor;

    const finalActualExitTime = new Date(
      `${new Date().toISOString().split("T")[0]}T${actualExitTime}:00`
    );

    if (finalActualExitTime < new Date(entrytime)) {
      return res.status(400).json({
        message: "Actual exit time cannot be before entry time.",
      });
    }

    if (finalActualExitTime > new Date(plannedexittime)) {
      return res.status(400).json({
        message: "Actual exit time cannot be later than the planned exit time.",
      });
    }

    // Update exit time and mark visitor inactive
    const updateExitTimeQuery = `
      UPDATE visitors 
      SET exittime = $1, is_active = false 
      WHERE visitorid = $2 
      RETURNING *;
    `;
    const updatedVisitor = await client.query(updateExitTimeQuery, [
      finalActualExitTime,
      visitorid,
    ]);

    res.status(200).json({
      message: "Visitor signed out successfully.",
      visitor: updatedVisitor.rows[0],
    });
  } catch (error) {
    console.error("Visitor Sign-Out Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

//Get Visitors
const getVisitors = async (req, res) => {
  try {
    const visitors = await client.query("SELECT * FROM visitors");
    res.status(200).json(visitors.rows);
  } catch (error) {
    res.status(500).json({ mesage: "Could not fetch rooms." });
  }
};

// Fetch My Visitors (Active)
const myVisitor = async (req, res) => {
  const tenantId = req.tenantId;

  try {
    // Step 1: Get rooms booked by this tenant
    const roomQuery = `
      SELECT room_id FROM bookings 
      WHERE tenant_id = $1
    `;
    const roomResult = await client.query(roomQuery, [tenantId]);

    if (roomResult.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No room found for this tenant." });
    }

    const roomIds = roomResult.rows.map((row) => row.room_id);

    // Step 2: Fetch active visitors to these rooms
    const visitorsQuery = `
      SELECT * FROM visitors 
      WHERE visitedroomid = ANY($1) AND is_active = true
    `;
    const visitorsResult = await client.query(visitorsQuery, [roomIds]);

    res.status(200).json({ visitors: visitorsResult.rows });
  } catch (error) {
    console.error("Fetch My Visitor Error:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = { getVisitors, signInVisitor, signOutVisitor, myVisitor };
