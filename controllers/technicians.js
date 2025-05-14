const client = require("../config/db");

//Get Technicians
const getTechnicians = async (req, res) => {
  try {
    const technicians = await client.query("SELECT * FROM technicians");
    res.status(200).json(technicians.rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch technicians" });
  }
};


module.exports = {getTechnicians}