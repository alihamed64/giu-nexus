const JobPost = require("../models/JobPost");
const hf = require("../services/hfService");

// GET /api/v1/jobs
const getAllJobs = async (req, res) => {
  try {
    const { keyword, location, type, status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (location) filter.location = new RegExp(location, "i");
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (keyword) filter.title = new RegExp(keyword, "i");

    const total = await JobPost.countDocuments(filter);
    const jobs = await JobPost.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ success: true, total, page: Number(page), jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/v1/jobs
const createJob = async (req, res) => {
  try {
    // Block pending recruiters
    if (req.user.status === "pending") {
      return res.status(403).json({
        success: false,
        message: "Your account is pending approval. Wait for admin approval before posting jobs.",
      });
    }

    let category = "Other";

    // AI classification
    try {
      const result = await hf.zeroShotClassification({
        model: "facebook/bart-large-mnli",
        inputs: [req.body.description],
        parameters: {
          candidate_labels: ["Frontend", "Backend", "AI/ML", "DevOps", "Data Engineering", "Other"],
        },
      });
      category = result[0].labels[0];
    } catch (aiError) {
      console.error("Classification failed, defaulting to Other:", aiError.message);
    }

    const job = await JobPost.create({
      ...req.body,
      category,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/jobs/:id
const getJobById = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id).populate("createdBy", "name email");
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/v1/jobs/:id
const updateJob = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorised to edit this job" });
    }

    // Re-classify if description changed
    if (req.body.description) {
      try {
        const result = await hf.zeroShotClassification({
          model: "facebook/bart-large-mnli",
          inputs: [req.body.description],
          parameters: {
            candidate_labels: ["Frontend", "Backend", "AI/ML", "DevOps", "Data Engineering", "Other"],
          },
        });
        req.body.category = result[0].labels[0];
      } catch (aiError) {
        console.error("Re-classification failed:", aiError.message);
      }
    }

    const updatedJob = await JobPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, job: updatedJob });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/v1/jobs/:id
const deleteJob = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    const isOwner = job.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorised to delete this job" });
    }

    await JobPost.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllJobs, createJob, getJobById, updateJob, deleteJob };
