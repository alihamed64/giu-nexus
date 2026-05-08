const User = require("../models/User");
const bcrypt = require("bcryptjs");
const hf = require("../services/hfService");

// GET /api/v1/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/v1/profile
const updateProfile = async (req, res) => {
  try {
    const { name, bio, profilePicture } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, profilePicture },
      { new: true, runValidators: true }
    ).select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PATCH /api/v1/profile/change-password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/v1/profile/extract-skills (AI)
const extractSkills = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.bio) {
      return res.status(400).json({ success: false, message: "Bio is empty. Update your profile first." });
    }

    try {
      // Call Hugging Face NER model
      const result = await hf.tokenClassification({
        model: "dslim/bert-base-NER",
        inputs: user.bio,
      });

      // Filter for technology/org tags and clean up
      const skills = result
        .filter((entity) => ["B-MISC", "I-MISC", "B-ORG"].includes(entity.entity_group))
        .map((entity) => entity.word.replace(/^##/, "").trim())
        .filter((word) => word.length > 1);

      // Remove duplicates
      const uniqueSkills = [...new Set(skills)];

      user.skills = uniqueSkills;
      await user.save();

      res.status(200).json({ success: true, skills: uniqueSkills, extracted: uniqueSkills });
    } catch (aiError) {
      // If AI fails, return existing skills
      console.error("HuggingFace error:", aiError.message);
      res.status(200).json({ success: true, skills: user.skills, extracted: user.skills });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile, changePassword, extractSkills };