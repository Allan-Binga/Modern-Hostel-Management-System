const client = require("../config/db");

//Get Bookings
const getBookings = async (req, res) => {
  try {
    const bookings = await client.query("SELECT * FROM bookings");
    res.status(200).json(bookings.rows);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch bookings." });
  }
};

// Get My Booking with Room Price
const usersBookings = async (req, res) => {
  const tenantId = req.tenantId;
  try {
    const query = `
      SELECT 
        bookings.*, 
        rooms.price AS room_price
      FROM bookings
      JOIN rooms ON bookings.room_id = rooms.roomid
      WHERE bookings.tenant_id = $1
    `;
    const result = await client.query(query, [tenantId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching bookings:", error.message);
    res.status(500).json({ message: "Could not fetch user's bookings." });
  }
};

// Book a Room
const bookARoom = async (req, res) => {
  const { roomId, checkInDate, checkOutDate } = req.body;
  const tenantId = req.tenantId;

  try {
    // Check if the tenant exists
    const tenant = await client.query("SELECT * FROM tenants WHERE id = $1", [
      tenantId,
    ]);

    if (tenant.rowCount === 0) {
      return res.status(404).json({ message: "Tenant does not exist." });
    }

    // Check if tenant already has an active booking
    const existingBooking = await client.query(
      `SELECT * FROM bookings 
       WHERE tenant_id = $1 
       AND check_out_date >= CURRENT_DATE`,
      [tenantId]
    );

    if (existingBooking.rowCount > 0) {
      return res.status(400).json({
        message: "Tenant already has an active booking.",
      });
    }

    // Ensure check-out date is at least 2 months after check-in
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const twoMonthsLater = new Date(checkIn);
    twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);

    if (checkOut < twoMonthsLater) {
      return res.status(400).json({
        message:
          "Check-out date must be at least 2 months after check-in date.",
      });
    }

    // Check room availability
    const room = await client.query(
      "SELECT * FROM rooms WHERE roomid = $1 AND status = 'Available'",
      [roomId]
    );

    if (room.rowCount === 0) {
      return res.status(404).json({
        message: "Room is already booked or does not exist.",
      });
    }

    // Proceed to create the booking
    const booking = await client.query(
      `INSERT INTO bookings 
        (tenant_id, room_id, booking_date, payment_status, check_in_date, check_out_date)
       VALUES ($1, $2, NOW(), 'Unpaid', $3, $4)
       RETURNING *`,
      [tenantId, roomId, checkInDate, checkOutDate]
    );

    // Update room status to 'Pending'
    await client.query(
      "UPDATE rooms SET status = 'Pending' WHERE roomid = $1",
      [roomId]
    );

    res.status(201).json({
      message: "Room booked successfully. Payment is pending.",
      booking: booking.rows[0],
    });
  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = { getBookings, bookARoom, usersBookings };
