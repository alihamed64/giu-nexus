const express = require("express");
const router = express.Router();
const { getAllJobs, createJob, getJobById, updateJob, deleteJob,
  getRecommendedJobs, getMyJobs, getSavedJobs, toggleSaveJob, getApplicants
} = require("../controllers/jobController");
const { applyToJob } = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/auth");

router.get("/recommended", protect, authorize("jobSeeker"), getRecommendedJobs);
router.get("/my-jobs", protect, authorize("recruiter"), getMyJobs);
router.get("/saved", protect, authorize("jobSeeker"), getSavedJobs);
router.get("/", getAllJobs);
router.post("/", protect, authorize("recruiter"), createJob);
router.get("/:id", getJobById);
router.patch("/:id", protect, authorize("recruiter"), updateJob);
router.delete("/:id", protect, authorize("recruiter", "admin"), deleteJob);
router.post("/:id/save", protect, authorize("jobSeeker"), toggleSaveJob);
router.get("/:jobId/applicants", protect, authorize("recruiter"), getApplicants);
router.post("/:jobId/apply", protect, authorize("jobSeeker"), applyToJob);

module.exports = router;
