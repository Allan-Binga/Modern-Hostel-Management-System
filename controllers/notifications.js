const client = require("../config/db");

//Get All Notifications
const getNotifications = async (req, res) => {
  try {
    const alerts = await client.query(`SELECT * FROM notifications`);
    res.status(200).json(alerts.rows);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch notifications." });
  }
};

//Create Notification
const createNotification = async (tenantId, message) => {
  try {
    await client.query(
      `INSERT INTO notifications (tenant_id, message)
           VALUES ($1, $2)`,
      [tenantId, message]
    );
    // console.log("Notification created.");
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

//Get My Notifications
const getMyNotifications = async (req, res) => {
  const tenantId = req.tenantId;

  if (!tenantId) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No tenant ID provided." });
  }

  try {
    const result = await client.query(
      `SELECT * FROM notifications WHERE tenant_id = $1 ORDER BY notification_date DESC`,
      [tenantId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching tenant notifications:", error);
    res.status(500).json({ message: "Could not fetch your notifications." });
  }
};

//Mark Notifications as 'Read'
const readNotifications = async (req, res) => {
  const { notificationId } = req.params;
  const tenantId = req.tenantId;

  if (!tenantId) {
    return res
      .status(401)
      .json({ message: "Unauthorized. No tenantID provided." });
  }
  try {
    const result = await client.query(
      `UPDATE notifications 
             SET status = 'read' 
             WHERE notification_id = $1 AND tenant_id = $2 
             RETURNING *`,
      [notificationId, tenantId]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: "Notification not found or not authorized." });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating notification status:", error);
    res.status(500).json({ message: "Could not read notification." });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  getMyNotifications,
  readNotifications,
};
