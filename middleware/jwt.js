const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

//Tenant ID Middleware
const authTenant = (req, res, next) => {
  try {
    const token = req.cookies.tenantPrestigeSession;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Please login as tenant." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.tenantId = decoded.id;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or expired tenant token." });
  }
};

//Administrator ID middleware
const authAdmin = (req, res, next) => {
  try {
    const token = req.cookies.adminPrestigeSession;
    if (!token) {
      return res
        .status(500)
        .json({ message: "Unauthorized. Please login as an administrator." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid or expired administrator token/" });
  }
};

module.exports = { authTenant, authAdmin };
