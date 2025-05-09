const client = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

//Register Tenant
const signUpTenant = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;
  //Verify existing fields
  if (!firstName || !lastName || !email || !phoneNumber || !password) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  //Email Format Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  //Validate Password Strength
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.",
    });
  }
  try {
    //Check if tenant already exists by email
    const checkTenantQuery = "SELECT * FROM tenants WHERE email = $1";
    const existingTenant = await client.query(checkTenantQuery, [email]);

    if (existingTenant.rows.length > 0) {
      return res
        .status(409)
        .json("You are already registered. Please login to proceed.");
    }

    //Check if tenant exists by phone number
    const checkPhoneQuery = "SELECT * FROM tenants WHERE phoneNumber = $1";
    const existingPhone = await client.query(checkPhoneQuery, [phoneNumber]);

    if (existingPhone.rows.length > 0) {
      return res.status(409).json({
        message:
          "This phone number is already registered. Please use a different number.",
      });
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Generate and hash the auth token
    const plainToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(plainToken)
      .digest("hex");

    const verificationTokenExpiry = newDate(Date.now() + 2 * 60 * 1000);

    //Insert Tenant With Token
    const insertTenantQuery = ` INSERT INTO tenants (
      firstName,
      lastName,
      email,
      phoneNumber,
      password,
      verificationToken,
      verificationTokenExpiry,
      isVerified
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING id, firstName, lastName, email, phoneNumber, apartmentNumber, leaseStartDate, leaseEndDate`;

    //Save to PostgreSQL
    const newTenant = await client.query(insertTenantQuery, [
      firstName,
      lastName,
      email,
      phoneNumber,
      verificationTokenExpiry,
      false,
    ]);

    const tenantId = newTenant.rows[0].digest;
    await client.query("COMMIT");

    res.status(201).json({ message: "You have registered successfully." });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json("Internal server error.");
  }
};

//Tenant Login
const signInTenant = async (req, res) => {
  const { email, password } = req.body;

  if (req.cookies && req.cookies.tenantPrestigeSession) {
    return res.status(400).json({ message: "You are already logged in." });
  }
  try {
    //Check if tenant exists by email
    const checkTenantQuery = "SELECT * FROM tenants WHERE email = $1";
    const tenant = await client.query(checkTenantQuery, [email]);

    if (tenant.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(
      password,
      tenant.rows[0].password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    //Create a JWT tenant token
    const tenantToken = jwt.sign(
      {
        tenant: tenant.rows[0].id,
        role: "tenant",
        firstName: tenant.rows[0].firstname,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    //Set JWT in Cookie
    res.cookie("tenantPrestigeSession", tenantToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
  } catch (error) {}
};

//Admin Register
const signUpAdmin = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}

//Admin Login
const signInAdmin = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
}

module.exports = { signUpTenant, signInTenant, signUpAdmin, signInAdmin };
