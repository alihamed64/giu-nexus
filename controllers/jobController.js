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

// GET /api/v1/jobs/recommended
const getRecommendedJobs = async (req, res) => {
  try {
    const user = req.user;
    const openJobs = await JobPost.find({ status: "open" });

    if (!user.skills || user.skills.length === 0) {
      return res.status(200).json({ success: true, jobs: openJobs });
    }

    const studentText = user.skills.join(", ");
    const jobTexts = openJobs.map((job) => `${job.title} ${job.requirements.join(" ")}`);

    try {
      const embeddings = await hf.featureExtraction({
        model: "sentence-transformers/all-MiniLM-L6-v2",
        inputs: [studentText, ...jobTexts],
      });

      const cosineSimilarity = (vecA, vecB) => {
        const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
        const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
        const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
        return dot / (magA * magB);
      };

      const studentVec = embeddings[0];
      const scoredJobs = openJobs.map((job, i) => ({
        ...job.toObject(),
        score: cosineSimilarity(studentVec, embeddings[i + 1]),
      }));

      scoredJobs.sort((a, b) => b.score - a.score);
      res.status(200).json({ success: true, jobs: scoredJobs });
    } catch (aiError) {
      console.error("Embedding failed, returning all open jobs:", aiError.message);
      res.status(200).json({ success: true, jobs: openJobs });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/jobs/my-jobs
const getMyJobs = async (req, res) => {
  try {
    const jobs = await JobPost.find({ createdBy: req.user._id });
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/jobs/saved
const getSavedJobs = async (req, res) => {
  try {
    const user = await require("../models/User").findById(req.user._id).populate("savedJobs");
    res.status(200).json({ success: true, jobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/v1/jobs/:id/save
const toggleSaveJob = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    if (job.status === "closed") {
      return res.status(400).json({ success: false, message: "Cannot save a closed job" });
    }

    const User = require("../models/User");
    const user = await User.findById(req.user._id);
    const alreadySaved = user.savedJobs.includes(req.params.id);

    if (alreadySaved) {
      user.savedJobs = user.savedJobs.filter((id) => id.toString() !== req.params.id);
      await user.save();
      return res.status(200).json({ success: true, message: "Job removed from saved", saved: false });
    } else {
      user.savedJobs.push(req.params.id);
      await user.save();
      return res.status(200).json({ success: true, message: "Job saved", saved: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/v1/jobs/:jobId/applicants
const getApplicants = async (req, res) => {
  try {
    const job = await JobPost.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorised to view applicants" });
    }

    const Application = require("../models/Application");
    const applications = await Application.find({ job: req.params.jobId }).populate(
      "user",
      "name email skills"
    );

    res.status(200).json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  getAllJobs, createJob, getJobById, updateJob, deleteJob,
  getRecommendedJobs, getMyJobs, getSavedJobs, toggleSaveJob, getApplicants
};