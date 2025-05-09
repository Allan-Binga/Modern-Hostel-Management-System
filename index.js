const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("cors");
const authRoute = require("./routes/auth");
const cookieParser = require("cookie-parser");

require("./config/db");

dotenv.config();
const app = express();

//Cookie Parser
app.use(cookieParser());

//Routes
app.use("/prestige-hostel", authRoute);

const PORT = process.env.PORT || 5900;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
