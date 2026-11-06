const express = require("express");

const authenticate = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");
const upload = require("../middleware/uploadMiddleware");
const { exportLeads, importLeads } = require("../controllers/leadController");
const {
  createLead,
  submitEnquiry,
  getLeads,
  updateLead,
  deleteLead,
    getDashboardStats,
} = require("../controllers/leadController");


const router = express.Router();

// All lead operations require authentication
router.use(authenticate);
router.get("/stats", requireRole("admin"), getDashboardStats);

// Admin manually creates a lead
router.post("/", requireRole("admin"), createLead);

// Registered customer submits an enquiry
router.post("/enquiry", requireRole("user"), submitEnquiry);

// Retrieve leads with pagination, search, filtering and sorting
router.get("/", getLeads);

router.post(
  "/import",
  requireRole("admin"),
  upload.single("file"),
  importLeads,
);
router.patch("/:id", requireRole("admin"), updateLead);
router.delete("/:id", requireRole("admin"), deleteLead);

router.get("/export", requireRole("admin"), exportLeads);
router.post(
  "/import",
  requireRole("admin"),
  upload.single("file"),
  importLeads,
);

module.exports = router;
