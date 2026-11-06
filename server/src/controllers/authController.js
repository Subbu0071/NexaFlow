const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { Op } = require("sequelize");

const { User, ActiveSession, PasswordReset } = require("../models");
const sequelize = require("../config/database");
const { sendPasswordResetEmail } = require("../services/emailService");

// =====================================================
// REGISTER
// =====================================================

const register = async (req, res) => {
  try {
    const { name, email, mobile, password, confirmPassword } = req.body || {};

    // Validate required fields
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof mobile !== "string" ||
      typeof password !== "string" ||
      typeof confirmPassword !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !mobile.trim() ||
      !password ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    // Validate name
    if (normalizedName.length < 2 || normalizedName.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must contain between 2 and 100 characters.",
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Normalize Indian mobile number
    let normalizedMobile = mobile.replace(/[\s()-]/g, "");

    if (normalizedMobile.startsWith("+91")) {
      normalizedMobile = normalizedMobile.slice(3);
    } else if (
      normalizedMobile.startsWith("91") &&
      normalizedMobile.length === 12
    ) {
      normalizedMobile = normalizedMobile.slice(2);
    }

    // Validate mobile
    if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid 10-digit Indian mobile number.",
      });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    // Confirm password
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    // Check duplicate email or mobile
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email: normalizedEmail }, { mobile: normalizedMobile }],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          existingUser.email === normalizedEmail
            ? "An account with this email already exists."
            : "An account with this mobile number already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Public registration can ONLY create normal users
    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      mobile: normalizedMobile,
      password: hashedPassword,
      role: "user",
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({
        success: false,
        message: "Email or mobile number is already registered.",
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong during registration.",
    });
  }
};

// =====================================================
// LOGIN
// =====================================================

const login = async (req, res) => {
  try {
const { identifier, password, deviceId } = req.body;
    if (
      typeof identifier !== "string" ||
      typeof password !== "string" ||
      typeof deviceId !== "string" ||
      !identifier.trim() ||
      !password ||
      !deviceId.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Email/mobile number, password and device ID are required.",
      });
    }

   const normalizedIdentifier = identifier.trim();

   let user;

   if (normalizedIdentifier.includes("@")) {
     // Login using email
     user = await User.findOne({
       where: {
         email: normalizedIdentifier.toLowerCase(),
       },
     });
   } else {
     // Login using mobile number
     let normalizedMobile = normalizedIdentifier.replace(/[\s()-]/g, "");

     if (normalizedMobile.startsWith("+91")) {
       normalizedMobile = normalizedMobile.slice(3);
     } else if (
       normalizedMobile.startsWith("91") &&
       normalizedMobile.length === 12
     ) {
       normalizedMobile = normalizedMobile.slice(2);
     }

     if (!/^[6-9]\d{9}$/.test(normalizedMobile)) {
       return res.status(400).json({
         success: false,
         message: "Enter a valid email address or 10-digit mobile number.",
       });
     }

     user = await User.findOne({
       where: {
         mobile: normalizedMobile,
       },
     });
   }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive.",
      });
    }

    const sessionId = uuidv4();
    const refreshToken = crypto.randomBytes(64).toString("hex");

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const now = new Date();
    const heartbeatTimeout = new Date(now.getTime() - 90 * 1000);
    const sessionExpiry = new Date(now.getTime() + 8 * 60 * 60 * 1000);

    // Create session safely using a transaction
    const result = await sequelize.transaction(async (transaction) => {
      const lockedUser = await User.findByPk(user.id, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!lockedUser || !lockedUser.isActive) {
        return { inactive: true };
      }

      const existingSession = await ActiveSession.findOne({
        where: { userId: lockedUser.id },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (existingSession) {
        const isSessionActive =
          new Date(existingSession.expiresAt) > now &&
          new Date(existingSession.lastHeartbeat) > heartbeatTimeout;

        if (isSessionActive) {
          return { alreadyLoggedIn: true };
        }

        await existingSession.destroy({ transaction });
      }

      await ActiveSession.create(
        {
          userId: lockedUser.id,
          sessionId,
          refreshTokenHash,
          deviceId: deviceId.trim(),
          lastHeartbeat: now,
          expiresAt: sessionExpiry,
        },
        { transaction },
      );

      const accessToken = jwt.sign(
        {
          sessionId,
          role: lockedUser.role,
        },
        process.env.JWT_ACCESS_SECRET,
        {
          subject: lockedUser.id,
          expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
        },
      );

      return { accessToken };
    });

    if (result.inactive) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive.",
      });
    }

    if (result.alreadyLoggedIn) {
      return res.status(409).json({
        success: false,
        message: "This account is already active on another device.",
      });
    }

    // HttpOnly refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      accessToken: result.accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong during login.",
    });
  }
};

// =====================================================
// GET CURRENT USER
// =====================================================

const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Authenticated user retrieved successfully.",
    user: req.user,
  });
};

// =====================================================
// HEARTBEAT
// =====================================================

const heartbeat = async (req, res) => {
  try {
    const session = await ActiveSession.findOne({
      where: {
        userId: req.user.id,
        sessionId: req.user.sessionId,
      },
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Active session not found. Please log in again.",
      });
    }

    const now = new Date();

    if (
      new Date(session.expiresAt) <= now ||
      now.getTime() - new Date(session.lastHeartbeat).getTime() > 90 * 1000
    ) {
      await session.destroy();

      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    await session.update({
      lastHeartbeat: now,
    });

    return res.status(200).json({
      success: true,
      message: "Session heartbeat updated successfully.",
      lastHeartbeat: now,
    });
  } catch (error) {
    console.error("Heartbeat error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update session heartbeat.",
    });
  }
};

// =====================================================
// LOGOUT
// =====================================================

const logout = async (req, res) => {
  try {
    await ActiveSession.destroy({
      where: {
        userId: req.user.id,
        sessionId: req.user.sessionId,
      },
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to logout.",
    });
  }
};

// =====================================================
// REFRESH ACCESS TOKEN
// =====================================================

const refreshAccessToken = async (req, res) => {
  const clearRefreshCookie = () => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
  };

  try {
    const oldRefreshToken = req.cookies?.refreshToken;

    if (!oldRefreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is missing. Please log in again.",
      });
    }

    const oldTokenHash = crypto
      .createHash("sha256")
      .update(oldRefreshToken)
      .digest("hex");

    const result = await sequelize.transaction(async (transaction) => {
      const session = await ActiveSession.findOne({
        where: {
          refreshTokenHash: oldTokenHash,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!session) {
        return { invalid: true };
      }

      const now = new Date();

      const isStale =
        now.getTime() - new Date(session.lastHeartbeat).getTime() > 90 * 1000;

      if (new Date(session.expiresAt) <= now || isStale) {
        await session.destroy({ transaction });
        return { invalid: true };
      }

      const user = await User.findByPk(session.userId, {
        transaction,
      });

      if (!user || !user.isActive) {
        await session.destroy({ transaction });
        return { invalid: true };
      }

      // Rotate refresh token
      const newRefreshToken = crypto.randomBytes(64).toString("hex");

      const newRefreshTokenHash = crypto
        .createHash("sha256")
        .update(newRefreshToken)
        .digest("hex");

      await session.update(
        {
          refreshTokenHash: newRefreshTokenHash,
        },
        { transaction },
      );

      const accessToken = jwt.sign(
        {
          sessionId: session.sessionId,
          role: user.role,
        },
        process.env.JWT_ACCESS_SECRET,
        {
          subject: user.id,
          expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
        },
      );

      return {
        accessToken,
        newRefreshToken,
      };
    });

    if (result.invalid) {
      clearRefreshCookie();

      return res.status(401).json({
        success: false,
        message: "Refresh token is invalid or expired. Please log in again.",
      });
    }

    res.cookie("refreshToken", result.newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 8 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Access token refreshed successfully.",
      accessToken: result.accessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to refresh access token.",
    });
  }
};

// =====================================================
// FORGOT PASSWORD
// =====================================================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "A valid email address is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      where: { email: normalizedEmail },
    });

    const genericResponse = {
      success: true,
      message:
        "If an account exists with this email, a password reset link will be sent.",
    };

    if (!user || !user.isActive) {
      return res.status(200).json(genericResponse);
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Invalidate previous unused reset requests
    await PasswordReset.destroy({
      where: {
        userId: user.id,
        usedAt: null,
      },
    });

    await PasswordReset.create({
      userId: user.id,
      tokenHash,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${encodeURIComponent(resetToken)}`;

    try {
      await sendPasswordResetEmail(user.email, resetUrl);
    } catch (emailError) {
      await PasswordReset.destroy({
        where: { tokenHash },
      });

      console.error("Password reset email failed:", emailError.message);
    }

    return res.status(200).json(genericResponse);
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process your request right now.",
    });
  }
};

// =====================================================
// RESET PASSWORD
// =====================================================

const resetPassword = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { token, newPassword } = req.body || {};

    if (
      typeof token !== "string" ||
      !token.trim() ||
      typeof newPassword !== "string"
    ) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Reset token and new password are required.",
      });
    }

    if (newPassword.length < 8) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters.",
      });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const resetRequest = await PasswordReset.findOne({
      where: {
        tokenHash,
        usedAt: null,
      },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!resetRequest) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Invalid or already used password reset link.",
      });
    }

    if (new Date(resetRequest.expiresAt) <= new Date()) {
      await resetRequest.destroy({ transaction });
      await transaction.commit();

      return res.status(400).json({
        success: false,
        message: "Password reset link has expired. Please request a new one.",
      });
    }

    const user = await User.findByPk(resetRequest.userId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!user || !user.isActive) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Unable to reset password for this account.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await user.update({ password: hashedPassword }, { transaction });

    await resetRequest.update({ usedAt: new Date() }, { transaction });

    await PasswordReset.destroy({
      where: {
        userId: user.id,
        id: { [Op.ne]: resetRequest.id },
      },
      transaction,
    });

    // Revoke all active sessions after password reset
    await ActiveSession.destroy({
      where: { userId: user.id },
      transaction,
    });

    await transaction.commit();

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. Please log in with your new password.",
    });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }

    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password right now.",
    });
  }
};

// =====================================================
// EXPORT ALL CONTROLLERS
// =====================================================

module.exports = {
  register,
  login,
  getMe,
  heartbeat,
  logout,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
};
