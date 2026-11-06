require("dotenv").config();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function testEmail() {
  try {
    await transporter.verify();
    console.log("Gmail SMTP connection successful!");
  } catch (error) {
    console.error("Email connection failed:", error.message);
  }
}

testEmail();
