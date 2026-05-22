const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, updateUserStatus, deleteUser, getAdminStats } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

// 1. Force the admin security middleware layer globally for everything in this file
router.use(protect, authorize("admin"));

// 2. Change "/admin/stats" to just "/stats" so it correctly maps to /api/v1/admin/stats
// and place it ABOVE the /:id wildcard so it matches first!
router.get("/stats", getAdminStats);

// 3. Keep all your baseline user routes exactly the same underneath
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id/status", updateUserStatus);
router.delete("/:id", deleteUser);

module.exports = router;