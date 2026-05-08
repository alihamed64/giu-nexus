const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const { applyToJob } = require("../controllers/applicationController");

router.post("/:jobId/apply", protect, authorize("jobSeeker"), applyToJob);

module.exports = router;