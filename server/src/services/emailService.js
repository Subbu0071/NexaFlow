const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

const escapeHtml = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );

const sendPasswordResetEmail = async (to, resetUrl) => {
  await transporter.sendMail({
    from: `"NexaFlow Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset Your NexaFlow Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your NexaFlow account password.</p>
        <p>
          <a href="${resetUrl}"
             style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:6px;">
            Reset Password
          </a>
        </p>
        <p>This link will expire in 15 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <p>Regards,<br>NexaFlow Support Team</p>
      </div>
    `,
  });
};

const sendAccountCredentialsEmail = async ({
  to,
  name,
  email,
  mobile,
  password,
}) => {
  const loginUrl = `${process.env.CLIENT_URL}/login`;

  await transporter.sendMail({
    from: `"NexaFlow Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to NexaFlow – Your Account Login Credentials",
    text: `
Hello ${name},

Your NexaFlow account has been created by the administrator.

Login URL: ${loginUrl}
Registered Email: ${email}
Registered Mobile: ${mobile}
Default Password: ${password}

Please log in and use the Forgot Password option to set your own password as soon as possible.

Regards,
NexaFlow Support Team
    `,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#1e293b;">
        <h2>Welcome to NexaFlow!</h2>
        <p>Hello ${escapeHtml(name)},</p>
        <p>Your account has been created successfully by the administrator.</p>

        <div style="background:#f1f5f9;padding:20px;border-radius:8px;">
          <p><strong>Login URL:</strong>
            <a href="${escapeHtml(loginUrl)}">${escapeHtml(loginUrl)}</a>
          </p>
          <p><strong>Registered Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Registered Mobile:</strong> ${escapeHtml(mobile)}</p>
          <p><strong>Default Password:</strong> ${escapeHtml(password)}</p>
        </div>

        <p>
          Please log in using these credentials and select
          <strong>Forgot Password</strong> to set your personal password
          as soon as possible.
        </p>

        <p>Regards,<br>NexaFlow Support Team</p>
      </div>
    `,
  });
};

module.exports = {
  sendPasswordResetEmail,
  sendAccountCredentialsEmail,
};
