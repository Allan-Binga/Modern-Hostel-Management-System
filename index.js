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

require("./config/db");

dotenv.config();
const app = express();

//JSON
app.use(express.json());

//Cookie Parser
app.use(cookieParser());

//Routes
app.use("/prestige-hostel/v1/auth", authRoute);
app.use("/prestige-hostel/v1/rooms", roomsRoute);
app.use("/prestige-hostel/v1/visitors", visitorsRoute);
app.use("/prestige-hostel/v1/booking", bookingRoute);
app.use("/prestige-hostel/v1/issue", issueRoute);

const PORT = process.env.PORT || 5900;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
