const client = require("../config/db")

//Get Admins
const getAdministrators = async (req, res) => {
    try {
        const admins = await client.query("SELECT * FROM admins") 
        res.status(200).json(admins.rows)
    } catch (error) {
        res.status(500).json({message: "Failed to fetch administrators."})
    }
}

module.exports = {getAdministrators}