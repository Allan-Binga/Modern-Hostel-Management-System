const { message } = require("statuses");
const client = require("../config/db");

//Get Rooms
const getRooms = async (req, res) => {
  try {
    const { status } = req.query; // e.g., ?status=Available

    // Base query: fetch rooms that are not soft deleted
    let query = "SELECT * FROM rooms WHERE deleted_at IS NULL";
    const values = [];

    // Add filter if status is provided
    if (status) {
      query += " AND status = $1";
      values.push(status);
    }

    query += " ORDER BY roomid ASC"; // optional: order rooms by ID

    const result = await client.query(query, values);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Could not fetch rooms." });
  }
};

// Create a Room
const createARoom = async (req, res) => {
  try {
    const { room_type, price, beds } = req.body;
    const image = req.file?.location || null;

    // Input validation
    if (!room_type || !price || !beds) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Insert Query
    const insertRoomQuery = `
  INSERT INTO rooms (roomtype, status, price, beds, image)
  VALUES ($1, $2, $3, $4, $5)
`;

    await client.query(insertRoomQuery, [
      room_type,
      "Available",
      price,
      beds,
      image,
    ]);

    res.status(201).json({ message: "Room created successfully" });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Could not create a room." });
  }
};

//Update a Room
const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    // Validate field keys (only allow valid columns)
    const allowedFields = ['roomtype', 'status', 'price', 'beds', 'image'];
    const setClauses = [];
    const values = [];
    let index = 1;

    for (const key in fields) {
      if (!allowedFields.includes(key)) {
        return res.status(400).json({ message: `Invalid field: ${key}` });
      }
      setClauses.push(`${key} = $${index}`);
      values.push(fields[key]);
      index++;
    }

    const updateQuery = `
      UPDATE rooms
      SET ${setClauses.join(", ")}
      WHERE roomid = $${index}
      RETURNING *
    `;

    values.push(id);

    const result = await client.query(updateQuery, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Room not found." });
    }

    res.status(200).json({ message: "Room updated successfully" });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ message: "Could not update room" });
  }
};

//Delete Room
const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    // Soft delete only if room is Available
    const softDeleteQuery = `
      UPDATE rooms
      SET deleted_at = NOW(),
          status = 'Unavailable'
      WHERE roomid = $1 AND deleted_at IS NULL AND status = 'Available'
      RETURNING *
    `;

    const result = await client.query(softDeleteQuery, [id]);

    if (result.rowCount === 0) {
      return res.status(400).json({
        message: "Room cannot be deleted. It may be occupied, pending, or already deleted.",
      });
    }

    res.status(200).json({
      message: "Room deleted successfully",
      room: result.rows[0],
    });

  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ message: "Could not delete room." });
  }
};

module.exports = { getRooms, createARoom, updateRoom, deleteRoom };
