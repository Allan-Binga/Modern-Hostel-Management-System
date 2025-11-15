const nodemailer = require("nodemailer");
const SibApiV3Sdk = require("sib-api-v3-sdk")
const client = require("../config/db");
const crypto = require("crypto");
const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

const defaultClient = SibApiV3Sdk.ApiClient.instance;

// Configure API key authorization
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// GENERATE PDF DOCUMENTS
const createReceipt = ({ amountPaid, roomNumber, currentDate }) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      resolve(pdfData);
    });
    doc.on("error", reject);

    // Format the date nicely (e.g., May 22, 2025)
    const formattedDate = new Date(currentDate).toLocaleDateString("en-KE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const logoPath = path.join(__dirname, "../assets/prestigeLogo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 30, { width: 80 });
    }

    // Centered header text
    const contentWidth = 595.28 - 2 * 50;
    const headerX = 150;
    const headerWidth = contentWidth - 100;

    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .fillColor("#003087")
      .text("Prestige Girls Hostel", headerX, 30, {
        width: headerWidth,
        align: "center",
      });

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#333333")
      .text("Ongata Rongai, Kajiado", headerX, 55, {
        width: headerWidth,
        align: "center",
      });

    doc.text(
      "Phone: +254 757942602 | Email: prestigehostel8@gmail.com",
      headerX,
      70,
      {
        width: headerWidth,
        align: "center",
      }
    );

    // Add date at top-right
    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#333333")
      .text(`Date: ${formattedDate}`, 400, 120, { align: "right" });

    // Title
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor("#003087")
      .text("Rent Payment Receipt", 0, 140, { align: "center" });

    doc.moveDown(2);

    // Table section
    const tableTop = 180;
    const tableLeft = 50;
    const tableWidth = 500;
    const rowHeight = 30;

    // Header row
    doc
      .rect(tableLeft, tableTop, tableWidth, rowHeight)
      .fill("#f5f5f5")
      .stroke("#dddddd");

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#333333")
      .text("Description", tableLeft + 10, tableTop + 10)
      .text("Details", tableLeft + 300, tableTop + 10);

    // Data rows
    doc
      .rect(tableLeft, tableTop + rowHeight, tableWidth, rowHeight * 2)
      .fill("#ffffff")
      .stroke("#dddddd");

    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("#333333")
      .text("Room Number", tableLeft + 10, tableTop + rowHeight + 10)
      .text(roomNumber, tableLeft + 300, tableTop + rowHeight + 10)
      .text("Amount Paid", tableLeft + 10, tableTop + rowHeight * 2 + 10)
      .text(
        `KES ${amountPaid}`,
        tableLeft + 300,
        tableTop + rowHeight * 2 + 10
      );

    // Outer border
    doc.rect(tableLeft, tableTop, tableWidth, rowHeight * 3).stroke("#dddddd");

    // Thank you message
    doc
      .font("Helvetica")
      .fontSize(12)
      .fillColor("#333333")
      .text(
        "Thank you for trusting Prestige Hostels.",
        0,
        tableTop + rowHeight * 4,
        { align: "center" }
      );

    // Footer
    const footerY = doc.page.height - 80;
    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#666666")
      .text("Prestige Girls Hostel", 0, footerY, {
        align: "center",
      });
    doc.text(
      "For inquiries, contact us at prestigehostel8@gmail.com",
      0,
      footerY + 15,
      { align: "center" }
    );

    doc.end();
  });
};

//Send Verification Email
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.CLIENT_URL}/account-verification?token=${token}`;

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  //Set properties one by one
  sendSmtpEmail.sender = {
    name: "Prestige Hostels",
    email: "noreply@prestigegirlshostel.co.ke"
  };
  sendSmtpEmail.to = [{ email }];
  sendSmtpEmail.subject = "Please verify your account";
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">Verify Your Account</h2>
        <p style="color: #555;">Click the button below to verify your account.</p>
        <a href="${verificationUrl}" 
          style="display: inline-block; padding: 10px 20px; margin-top: 15px; background-color: #2582b8; color: #fff; text-decoration: none; border-radius: 5px;">
          Verify My Account
        </a>
        <p style="margin-top: 20px; color: #777;">If you did not create an account, you can ignore this email.</p>
      </div>
    </div>
  `;

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Verification email sent:", response);
    return response;
  } catch (error) {
    console.error("Brevo API Error:", error.response?.text || error.message);
    throw error;
  }
};

//Verify Token sent in Verification Email
const verifyToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const findTenantQuery = `
    SELECT * FROM tenants WHERE verificationtoken = $1
  `;

    const result = await client.query(findTenantQuery, [hashedToken]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const tenant = result.rows[0];

    if (new Date(tenant.verificationtokenexpiry) < new Date()) {
      return res.status(400).json({
        message: "Token expired. Please request a new verification email.",
        email: tenant.email,
      });
    }

    const updateTenantQuery = `
      UPDATE tenants
      SET isverified = true
      WHERE id = $1
    `;
    await client.query(updateTenantQuery, [tenant.id]);
    res.json({ message: "Account verified successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

//Resend Verification Email
const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    //Check if tenant exisits
    const findTenantQuery = `SELECT * FROM tenants WHERE email =$1`;
    const result = await client.query(findTenantQuery, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Tenant not found." });
    }

    const tenant = result.rows[0];

    //Check if account is already verified
    if (tenant.isverified) {
      return res
        .status(400)
        .json({ message: "Account is already verified. Please login." });
    }

    // Generate new verification token
    const plainToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(plainToken)
      .digest("hex");

    const newExpiry = new Date(Date.now() + 2 * 60 * 1000);

    //Update tenant's token and expiry
    const updateTokenQuery = `
       UPDATE tenants 
      SET verificationtoken = $1, verificationtokenexpiry = $2 
      WHERE email = $3
      `;

    await client.query(updateTokenQuery, [hashedToken, newExpiry, email]);

    //Send verification email
    await sendVerificationEmail(email, plainToken);

    return res
      .status(200)
      .json({ message: "Verification email resent successfully." });
  } catch (error) {
    console.error("Error resending verification email:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Send Issue Report Email
const sendIssueReportEmail = async (email, category) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  // Set properties one by one
  sendSmtpEmail.sender = {
    name: "Prestige Hostels",
    email: "noreply@prestigegirlshostel.co.ke"
  };
  sendSmtpEmail.to = [{ email }];
  sendSmtpEmail.subject = "Issue Report Received";
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 15px rgba(0,0,0,0.15);">
        <h2 style="color: #333; margin-bottom: 10px;">Issue Report Received</h2>
        <p style="color: #555;">Hello,</p>
        <p style="color: #555;">Thank you, we have received your issue report regarding category: <strong>${category}</strong></p>
        <p style="color: #555;">One of our skilled technicians will be assigned to assist you shortly. Feel free to reach out if you have any questions.</p>
      </div>
    </div>
  `;

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Issue report email sent:", response);
    return response;
  } catch (error) {
    console.error("Brevo API Error:", error.response?.text || error.message);
    throw error;
  }
};

// Send Admin Email
const sendIssueSubmissionEmailAdmin = async (adminEmail, tenantId, category) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  // Set properties one by one
  sendSmtpEmail.sender = {
    name: "Prestige Hostels",
    email: "noreply@prestigegirlshostel.co.ke"
  };
  sendSmtpEmail.to = [{ email: adminEmail }];
  sendSmtpEmail.subject = "New Issue Reported - Action Required";
  sendSmtpEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 15px rgba(0,0,0,0.15);">
        <h2 style="color: #333;">New Issue Reported</h2>
        <p style="color: #555;">Dear Admin,</p>
        <p style="color: #555;">A new issue has been reported by tenant with the id of <strong>${tenantId}</strong> in the category of <strong>${category}</strong>.</p>
        <p style="color: #555;">Please log in to the platform to assign a technician for this issue.</p>
        <p style="margin-top: 20px; color: #777;">If you have any questions, please reach out to support.</p>
      </div>
    </div>
  `;

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Admin notification email sent to ${adminEmail}:`, response);
    return response;
  } catch (error) {
    console.error("Brevo API Error (Admin Email):", error.response?.text || error.message);
    throw error;
  }
};

// Send Technician Assignment Email
const technicianAssignmentEmail = async (
  email,
  technicianName,
  technicianPhone,
  issueCategory
) => {
  const sendSMTPEmail = new SibApiV3Sdk.SendSmtpEmail()

  //Set Properties
  sendSMTPEmail.sender = {
    name: "Prestige Hostels",
    email: "noreply@prestigegirlshostel.co.ke"
  };
  sendSMTPEmail.to = [{ email }]
  sendSMTPEmail.subject = "Technician Assignment"
  sendSMTPEmail.htmlContent = `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 15px rgba(0,0,0,0.15);">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:logo" alt="Prestige Girls Hostels" style="max-width: 200px; max-height: 200px;" />
        </div>
        <h2 style="color: #333; margin-bottom: 10px;">Technician Assigned</h2>
        <p style="color: #555;">Dear Tenant,</p>
        <p style="color: #555;">We have assigned a technician to address your issue in the category of <strong>${issueCategory}</strong>.</p>
        <h3 style="color: #333;">Technician Details:</h3>
        <p style="color: #555;"><strong>Name:</strong> ${technicianName}</p>
        <p style="color: #555;"><strong>Phone Number:</strong> ${technicianPhone}</p>
        <p style="color: #555;">Please reach out to the technician directly if necessary.</p>
        <p style="color: #555;">If your issue is resolved, please let us know. We are here to help you at any time.</p>
        <br>
        <p style="color: #777;">Best regards,<br>Prestige Girls Hostel Support Team</p>
      </div>
    </div>
  `;

  try {
    const response = await apiInstance.sendTransacEmail(sendSMTPEmail)
    // console.log(`Email sent to ${email} with technician details.`);
    return response;
  } catch (error) {
    console.error("Brevo API Error:", error.response?.text || error.message);
    throw error;
  }
};

//Send Payment Failure Email
const sendPaymentFailureEmail = async (email) => {
  const sendSMTPEmail = new SibApiV3Sdk.SendSmtpEmail()

  //Set Properties
  // const subject = "Failed Rent Payment Attempt";
  sendSMTPEmail.sender = {
    name: "Prestige Hostels",
    email: "noreply@prestigegirlshostel.co.ke"
  }
  sendSMTPEmail.to = [{ email }]
  sendSMTPEmail.subject = "Failed Rent Payment Attempt"
  sendSMTPEmail.htmlContent = ` 
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 15px rgba(0,0,0,0.15);">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:logo" alt="Prestige Girls Hostels" style="max-width: 200px; max-height: 200px;" />
        </div>
        <h2 style="color: #333; margin-bottom: 10px;">Recent Failed Payment Attempt</h2>
        <p style="color: #555;">Hello,</p>
        <p style="color: #555;">We recently received a failed payment attempt. Don't fret. Please retry again via Prestige Girls Portal. <strong> ${category}</strong></p> 
      </div>
    </div>`;


  try {
    const response = await apiInstance.sendTransacEmail(sendSMTPEmail)
    return response;
  } catch (error) {
    console.error("Brevo API Error:", error.response?.text || error.message);
    throw error;
  }
};

// Password Reset Email
const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/password/reset?token=${token}`;
  const sendSMTPEmail = new SibApiV3Sdk.SendSmtpEmail()

  //Set Properties
  sendSMTPEmail.sender = {
    name: "Prestige Hostels",
    email: "noreply@prestigegirlshostel.co.ke"
  }
  sendSMTPEmail.to = [{ email }]
  sendSMTPEmail.subject = "Password Reset Request Received"
  sendSMTPEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p style="color: #555;">Click the button below to reset your password.</p>
          <a href="${resetUrl}" 
            style="display: inline-block; padding: 10px 20px; margin-top: 15px; background-color: #ff9800; color: #fff; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
          <p style="margin-top: 20px; color: #777;">If you did not request this, ignore this email.</p>
        </div>
      </div>`;


  try {
    const response = await apiInstance.sendTransacEmail(sendSMTPEmail)
    console.log(`Password reset email sent to ${email}`);
    return response;
  } catch (error) {
    console.error("Brevo API Error:", error.response?.text || error.message);
    throw error;
  }
};

//Resend password reset email
const resendPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Check if tenant exists
    const result = await client.query(
      "SELECT * FROM tenants WHERE email = $1",
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate and store a new token and expiry
    const plainToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(plainToken)
      .digest("hex");
    const expiry = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

    await client.query(
      `UPDATE tenants 
       SET passwordresettoken = $1, passwordresettokenexpiry = $2 
       WHERE email = $3`,
      [hashedToken, expiry, email]
    );

    await sendPasswordResetEmail(email, plainToken);

    res.json({ message: "New password reset email sent." });
  } catch (error) {
    console.error("Error resending password reset email:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

//Verify the password reset token
const verifyPasswordResetToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token is required." });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const result = await client.query(
      `SELECT email, passwordresettokenexpiry 
       FROM tenants 
       WHERE passwordresettoken = $1`,
      [hashedToken]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    if (new Date(user.passwordresettokenexpiry) < new Date()) {
      return res.status(400).json({
        message: "Password reset token expired. Please request a new one.",
      });
    }

    res.status(200).json({ message: "Token is valid.", email: user.email });
  } catch (error) {
    console.error("Error verifying password reset token:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

//Send Rent Payment Email
const sendRentPaymentEmail = async (
  email,
  { amountPaid, roomNumber, paymentDate }
) => {
  const subject = "Rent Payment Confirmation";
  // console.log(amountPaid);
  // console.log(paymentDate);

  //Calculate Next Rent Date
  const currentDate = new Date(paymentDate);
  const nextPaymentDate = new Date(currentDate);
  nextPaymentDate.setDate(currentDate.getDate() + 30);
  const formattedNextPaymentDate = nextPaymentDate.toISOString().split("T")[0];

  //Generate PDF receipt
  const pdfBuffer = await createReceipt({
    amountPaid,
    roomNumber,
    currentDate,
  });

  const message = `
    <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">Rent Payment Received</h2>
        <p style="color: #555;">Hi,</p>
        <p style="color: #555;">We have received your rent payment for room <strong>${roomNumber}.</p>
        <p style="color: #555;">Your next rent payment is due by <strong>${formattedNextPaymentDate}</strong>.</p>
        <p style="margin-top: 20px; color: #777;">Thank you.</p>
      </div>
    </div>`;

  const mailOptions = {
    from: `"Prestige Girls Hostel" <${process.env.MAIL_USER}>`,
    to: email,
    subject: subject,
    html: message,
    attachments: [
      {
        filename: `receipt_${paymentDate}.pdf`,
        content: pdfBuffer,
        encoding: "base64",
      },
      {
        filename: "prestigeLogo.png",
        path: "./assets/prestigeLogo.png",
        cid: "logo",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  verifyToken,
  resendVerificationEmail,
  sendIssueReportEmail,
  sendPasswordResetEmail,
  sendPaymentFailureEmail,
  resendPasswordResetEmail,
  verifyPasswordResetToken,
  technicianAssignmentEmail,
  sendIssueSubmissionEmailAdmin,
  sendRentPaymentEmail,
};
