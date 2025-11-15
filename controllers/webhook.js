const axios = require("axios");
const dotenv = require("dotenv");
const client = require("../config/db");
const Stripe = require("stripe");
const { createNotification } = require("./notifications");
const { sendRentPaymentEmail } = require("./emailService");

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//Handle Stripe WebHooks
const handleStripeWebhook = async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK;
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return res.status(400).send("Webhook error.");
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const paymentId = session.metadata?.paymentId;
      const tenantId = session.metadata?.tenantId;
      const roomNumber = session.metadata?.roomNumber;
      const tenantEmail = session.metadata?.tenantEmail;
      const tenantName = session.metadata?.tenantName;

      let amountPaid;

      try {
        const paymentIntentId = session.payment_intent;
        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId
        );
        amountPaid = paymentIntent.metadata?.rentAmount;
        // console.log(amountPaid);

        if (!paymentId) {
          throw new Error("Payment ID not found in session metadata.");
        }
        if (!roomNumber) {
          throw new Error("Room Number not found in session's metadata.");
        }

        // Fetch tenant details
        const tenantQuery = `SELECT firstname, lastname, email FROM tenants WHERE id = $1`;
        const tenantResult = await client.query(tenantQuery, [tenantId]);

        if (tenantResult.rows.length === 0) {
          throw new Error("Tenant not found.");
        }

        // Fetch tenant's room_id from bookings
        const roomIdQuery = `SELECT room_id FROM bookings WHERE tenant_id = $1`;
        const roomResult = await client.query(roomIdQuery, [tenantId]);

        if (roomResult.rows.length === 0) {
          throw new Error("Room not found for tenant.");
        }

        const roomId = roomResult.rows[0].room_id;

        // Update Payment Status
        const updateQuery = `UPDATE payments SET payment_status = $1 WHERE payment_id = $2`;
        await client.query(updateQuery, ["Paid", paymentId]);
        // console.log(`Payment ${paymentId} marked as paid.`);

        // Update Booking Payment Status
        const updateBookingQuery = `UPDATE bookings SET payment_status = $1 WHERE tenant_id = $2`;
        await client.query(updateBookingQuery, ["Paid", tenantId]);
        // console.log(`Booking for tenant ${tenantId} marked as paid.`);

        //Update room status to 'Occupied'
        const updateRoomStatusQuery = `UPDATE rooms SET status = $1 WHERE roomid = $2`;
        await client.query(updateRoomStatusQuery, ["Occupied", roomId]);
        // console.log(`Room ${roomId} status set to Occupied.`);
        await createNotification(
          tenantId,
          `Hi ${tenantName}, thank you, we have received your rent.`
        );
        // Get the current date for payment date
        const paymentDate = new Date().toISOString().split("T")[0];

        await sendRentPaymentEmail(tenantEmail, {
          amountPaid,
          roomNumber: roomNumber,
          paymentDate,
        });

        return res.status(200).send("Webhook received and processed.");
      } catch (error) {
        console.error("Error processing webhook:", error.message);
        return res.status(500).send("Internal server error.");
      }

    case "payment_intent.payment_failed":
      const failedIntent = event.data.object;
      const failedPaymentId = failedIntent.metadata?.paymentId;

      try {
        if (failedPaymentId) {
          const updateQuery = `UPDATE payments SET payment_status = $1 WHERE payment_id = $2`;
          await client.query(updateQuery, ["Failed", failedPaymentId]);
          // console.log(`Payment ${failedPaymentId} marked as failed`);
        }
        return res.status(200).send("Webhook received and processed.");
      } catch (error) {
        console.error("Failed to mark payment as failed:", error.message);
        return res.status(500).send("Internal server error.");
      }

    default:
      // console.log(`Unhandled event type: ${event.type}`);
      return res.status(200).send("Webhook received.");
  }
};

module.exports = {
  handleStripeWebhook,
};
