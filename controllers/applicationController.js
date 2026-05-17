const Application = require("../models/Application");
const JobPost = require("../models/JobPost");

// POST /api/v1/jobs/:jobId/apply
const applyToJob = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    // Check for duplicate application
    const existing = await Application.findOne({ user: req.user._id, job: req.params.jobId });
    if (existing) {
      return res.status(400).json({ success: false, message: "You have already applied to this job" });
    }

    const application = await Application.create({
      user: req.user._id,
      job: req.params.jobId,
      coverLetter: req.body.coverLetter,
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/applications/my
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id }).populate(
      "job",
      "title company type status"
    );
    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/v1/applications/:id/status
const updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate("job");
    if (!application) return res.status(404).json({ success: false, message: "Application not found" });

    // Only the recruiter who owns the job can update status
    if (application.job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorised to update this application" });
    }

    application.status = req.body.status;
    await application.save();

    res.status(200).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/applications (admin only)
const getAllApplications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const total = await Application.countDocuments();
    const applications = await Application.find()
      .populate("user", "name email")
      .populate("job", "title company")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ success: true, total, page: Number(page), applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { applyToJob, getMyApplications, updateApplicationStatus, getAllApplications };