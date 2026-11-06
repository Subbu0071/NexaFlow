const express = require("express");
const authenticate = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");

const {
  getUsers,
  getUserById,
  updateUser,
  updateUserStatus,
    updateUserRole,
    deleteUser,
    createUser,
} = require("../controllers/AdminController");
const router = express.Router();

router.use(authenticate, requireRole("admin"));

// List all users
router.get("/users", getUsers);

// View individual user
router.get("/users/:id", getUserById);

// Update user details
router.patch("/users/:id", updateUser);
// Change user role

router.patch("/users/:id/status", updateUserStatus);

// Change user role
router.patch("/users/:id/role", updateUserRole);

router.delete("/users/:id", deleteUser);

router.post("/users", createUser);

module.exports = router;
