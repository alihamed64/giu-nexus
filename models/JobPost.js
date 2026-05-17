const mongoose = require("mongoose");

const jobPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: [String],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["full-time", "part-time", "internship"],
    required: true,
  },
  salary: {
    type: Number,
  },
  category: {
    type: String,
    enum: ["Frontend", "Backend", "AI/ML", "DevOps", "Data Engineering", "Other"],
    default: "Other",
  },
  totalSlots: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const JobPost = mongoose.model("JobPost", jobPostSchema);

module.exports = JobPost;
