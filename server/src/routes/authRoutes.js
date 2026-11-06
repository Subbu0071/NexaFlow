const express = require("express");

const {
  register,
  login,
  getMe,
  heartbeat,
  logout,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// Public authentication routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected authentication routes
router.get("/me", authenticate, getMe);
router.post("/heartbeat", authenticate, heartbeat);
router.post("/logout", authenticate, logout);

module.exports = router;
