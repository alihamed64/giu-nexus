const express = require("express");
const router = express.Router();
const { getAllJobs, createJob, getJobById, updateJob, deleteJob } = require("../controllers/jobController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", getAllJobs);
router.post("/", protect, authorize("recruiter"), createJob);
router.get("/:id", getJobById);
router.patch("/:id", protect, authorize("recruiter"), updateJob);
router.delete("/:id", protect, authorize("recruiter", "admin"), deleteJob);

module.exports = router;