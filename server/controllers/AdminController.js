const User = require("../models/User");
const Question = require("../models/Question");
const Answer = require("../models/Answer");
const Report = require("../models/Report");

// Get admin statistics
const getAdminStats = async (req, res) => {
  try {
    console.log("Admin stats endpoint called");
    console.log("User making request:", req.user);

    const totalUsers = await User.countDocuments();
    console.log("Total users found:", totalUsers);

    const totalQuestions = await Question.countDocuments();
    console.log("Total questions found:", totalQuestions);

    const totalAnswers = await Answer.countDocuments();
    console.log("Total answers found:", totalAnswers);

    const pendingReports = await Report.countDocuments({ status: "pending" });
    console.log("Pending reports found:", pendingReports);

    const bannedUsers = await User.countDocuments({ isBanned: true });
    console.log("Banned users found:", bannedUsers);

    const stats = {
      totalUsers,
      totalQuestions,
      totalAnswers,
      pendingReports,
      bannedUsers,
    };

    console.log("Sending stats response:", stats);
    res.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({
      message: "Error fetching admin statistics",
      success: false,
    });
  }
};

// Get all users (paginated)
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Error fetching users",
      success: false,
    });
  }
};

// Ban user
const banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    user.isBanned = true;
    user.banReason = reason || "Admin action";
    await user.save();

    res.json({
      message: "User banned successfully",
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        isBanned: user.isBanned,
        banReason: user.banReason,
      },
    });
  } catch (error) {
    console.error("Error banning user:", error);
    res.status(500).json({
      message: "Error banning user",
      success: false,
    });
  }
};

// Unban user
const unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    user.isBanned = false;
    user.banReason = null;
    await user.save();

    res.json({
      message: "User unbanned successfully",
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        isBanned: user.isBanned,
      },
    });
  } catch (error) {
    console.error("Error unbanning user:", error);
    res.status(500).json({
      message: "Error unbanning user",
      success: false,
    });
  }
};

// Delete question (admin)
const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        message: "Question not found",
        success: false,
      });
    }

    // Delete all answers for this question
    await Answer.deleteMany({ question: questionId });

    // Delete the question
    await Question.findByIdAndDelete(questionId);

    res.json({
      message: "Question and all its answers deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    res.status(500).json({
      message: "Error deleting question",
      success: false,
    });
  }
};

// Delete answer (admin)
const deleteAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;

    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({
        message: "Answer not found",
        success: false,
      });
    }

    await Answer.findByIdAndDelete(answerId);

    res.json({
      message: "Answer deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting answer:", error);
    res.status(500).json({
      message: "Error deleting answer",
      success: false,
    });
  }
};

// Get all reports
const getAllReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reports = await Report.find({})
      .populate("reporter", "name username email")
      .populate("question", "title")
      .populate("answer", "content")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReports = await Report.countDocuments();
    const totalPages = Math.ceil(totalReports / limit);

    res.json({
      reports,
      pagination: {
        currentPage: page,
        totalPages,
        totalReports,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({
      message: "Error fetching reports",
      success: false,
    });
  }
};

// Resolve report
const resolveReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { action } = req.body;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        message: "Report not found",
        success: false,
      });
    }

    report.status = "resolved";
    report.resolvedBy = req.user._id;
    report.resolvedAt = new Date();
    report.resolution = action;
    await report.save();

    res.json({
      message: "Report resolved successfully",
      success: true,
      report,
    });
  } catch (error) {
    console.error("Error resolving report:", error);
    res.status(500).json({
      message: "Error resolving report",
      success: false,
    });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  banUser,
  unbanUser,
  deleteQuestion,
  deleteAnswer,
  getAllReports,
  resolveReport,
};
