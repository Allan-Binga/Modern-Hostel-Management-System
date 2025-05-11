const nodemailer = require("nodemailer");
const client = require("../config/db");
const crypto = require("crypto");
const dotenv = require("dotenv");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
// const {createNotification} = require("./notifications")

dotenv.config()

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  //Send Verification Email
  const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.CLIENT_URL}/account-verification?token=${token}`;
  
    const mailOptions = {
      from: `"Murandi Apartments" <${process.env.MAIL_USER}>`, //Name and Email
      to: email,
      subject: "Please verify your account.",
      html: `  <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="color: #333;">Verify Your Account</h2>
            <p style="color: #555;">Click the button below to verify your account.</p>
            <a href="${verificationUrl}" 
              style="display: inline-block; padding: 10px 20px; margin-top: 15px; background-color: #2582b8; color: #fff; text-decoration: none; border-radius: 5px;">
              Verify My Account
            </a>
            <p style="margin-top: 20px; color: #777;">If you did not create an account, you can ignore this email.</p>
          </div>
        </div>`,
    };
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  };