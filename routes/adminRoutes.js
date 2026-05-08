const express = require("express");
const router = express.Router();
const { getAdminStats } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

router.get("/stats", protect, authorize("admin"), getAdminStats);

module.exports = router;
