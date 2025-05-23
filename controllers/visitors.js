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

    //Reject
    if (room.status.toLowerCase() === "Available") {
      return res
        .status(403)
        .json({ message: "No tenant in this room. Please try another room." });
    }

    // Prevent multiple active visits
    const activeVisitQuery = `
      SELECT * FROM visitors 
      WHERE phoneNumber = $1 AND visitedRoomId = $2 AND is_active = true
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
  const { visitorId, actualExitTime } = req.body;

  if (!visitorId || !actualExitTime) {
    return res.status(400).json({
      message: "Visitor ID and actual exit time are required to sign out.",
    });
  }

  try {
    // Verify visitor exists
    const checkVisitorQuery = "SELECT * FROM visitors WHERE visitorId = $1";
    const visitor = await client.query(checkVisitorQuery, [visitorId]);

    if (visitor.rows.length === 0) {
      return res.status(404).json({ message: "Visitor not found." });
    }

    const { entrytime, plannedexittime, is_active } = visitor.rows[0];

    if (!is_active) {
      return res
        .status(400)
        .json({ message: "Visitor is already signed out." });
    }

    const finalActualExitTime = new Date(
      `${new Date().toISOString().split("T")[0]}T${actualExitTime}:00`
    );

    // Validate Actual Exit Time
    if (finalActualExitTime < new Date(entrytime)) {
      return res
        .status(400)
        .json({ message: "Actual exit time cannot be before entry time." });
    }

    if (finalActualExitTime > new Date(plannedexittime)) {
      return res.status(400).json({
        message: "Actual exit time cannot be later than the planned exit time.",
      });
    }

    // Sign out the visitor (soft delete)
    const updateExitTimeQuery = `
      UPDATE visitors 
      SET exitTime = $1, is_active = false 
      WHERE visitorId = $2 
      RETURNING *;
    `;

    const updatedVisitor = await client.query(updateExitTimeQuery, [
      finalActualExitTime,
      visitorId,
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

//Fetch My Visitor
const myVisitor = async (req, res) => {
  try {
  } catch (error) {}
};

module.exports = { getVisitors, signInVisitor, signOutVisitor, myVisitor };
