const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    // Will be hashed before saving in Task 2
  },
  profilePicture: {
    type: String, // URL string, optional
  },
  bio: {
    type: String,
  },
  skills: {
    type: [String], // Filled automatically by AI in Task 2
    default: [],
  },
  role: {
    type: String,
    enum: ["jobSeeker", "recruiter", "admin"],
    default: "jobSeeker",
  },
  status: {
    // Only meaningful when role === "recruiter"
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpire: {
    type: Date
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;