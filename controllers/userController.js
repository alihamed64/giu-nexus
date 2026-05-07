const User = require("../models/User");
const JobPost = require("../models/JobPost");
const Application = require("../models/Application");

// @desc    Get all users (paginated, filterable by role and status)
// @route   GET /api/v1/users
// @access  Admin
const getUsers = async (req, res, next) => {
  try {
    const { role, status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password")
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user by ID
// @route   GET /api/v1/users/:id
// @access  Admin
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (approve / reject / pending)
// @route   PATCH /api/v1/users/:id/status
// @access  Admin
const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'approved', 'rejected', or 'pending'",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/v1/users/:id
// @access  Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform-wide statistics
// @route   GET /api/v1/admin/stats
// @access  Admin
const getAdminStats = async (req, res, next) => {
  try {
    const usersByRoleRaw = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);
    const usersByRole = usersByRoleRaw.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const jobsByStatusRaw = await JobPost.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const jobsByStatus = jobsByStatusRaw.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const appsByStatusRaw = await Application.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const appsByStatus = appsByStatusRaw.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const topJobs = await Application.aggregate([
      { $group: { _id: "$job", applicationCount: { $sum: 1 } } },
      { $sort: { applicationCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "jobposts",
          localField: "_id",
          foreignField: "_id",
          as: "jobDetails",
        },
      },
      { $unwind: "$jobDetails" },
      {
        $project: {
          _id: 1,
          title: "$jobDetails.title",
          company: "$jobDetails.company",
          applicationCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        usersByRole,
        jobsByStatus,
        appsByStatus,
        topJobs,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getAdminStats,
};