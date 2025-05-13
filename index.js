const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const roomsRoute = require("./routes/rooms");
const visitorsRoute = require("./routes/visitors");
const bookingRoute = require("./routes/booking");
const issueRoute = require("./routes/issueReport");
const advertRoute = require("./routes/adverts");
const checkoutRoute = require("./routes/rentCheckout");
const webhookRoute = require("./routes/webhook")

require("./config/db");

dotenv.config();
const app = express();

//JSON
app.use(express.json());

//Webhook Route
app.use("/prestige-hostel/v1/webhook", webhookRoute);

//Cookie Parser
app.use(cookieParser());

//Routes
app.use("/prestige-hostel/v1/auth", authRoute);
app.use("/prestige-hostel/v1/rooms", roomsRoute);
app.use("/prestige-hostel/v1/visitors", visitorsRoute);
app.use("/prestige-hostel/v1/booking", bookingRoute);
app.use("/prestige-hostel/v1/issue", issueRoute);
app.use("/prestige-hostel/v1/advertisements", advertRoute);
app.use("/prestige-hostel/v1/checkout", checkoutRoute);

const PORT = process.env.PORT || 5900;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
