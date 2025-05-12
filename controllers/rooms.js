const client = require("../config/db");

//Get Rooms
const getRooms = async (req, res) => {
  try {
    const rooms = await client.query("SELECT * FROM rooms");
    res.status(200).json(rooms.rows);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch rooms." });
  }
};

module.exports = { getRooms };
