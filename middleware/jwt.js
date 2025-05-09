const jwt = require("jsonwebtoken");

const authTenantAdmin = (req, res, next) => {
  const { tenantPrestigeSession, adminPrestigeSession } = req.cookies;

  let token;

  if (tenantPrestigeSession) {
    token = tenantPrestigeSession;
    req.role = "tenant";
  } else if (adminPrestigeSession) {
    token = adminPrestigeSession;
    req.role = "admin";
  } else {
    return res.status(401).json({ message: "Not logged in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = { authTenantAdmin };
