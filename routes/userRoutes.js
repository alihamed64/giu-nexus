const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, updateUserStatus, deleteUser, getAdminStats } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect, authorize("admin")); // All routes below are admin only

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.patch("/:id/status", updateUserStatus);
router.delete("/:id", deleteUser);

// Admin stats route
router.get("/admin/stats", getAdminStats);

module.exports = router;