const express = require("express");
const router = express.Router();

const {
  getAdminStats,
  getAllUsers,
  banUser,
  unbanUser,
  deleteQuestion,
  deleteAnswer,
  getAllReports,
  resolveReport,
} = require("../controllers/AdminController");

const ensureAuthenticated = require("../middlewares/Auth");

// Admin middleware - check if user is admin
const ensureAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      message: "Access denied. Admin privileges required.",
      success: false,
    });
  }
};

// Apply authentication and admin check to all routes
router.use(ensureAuthenticated);
router.use(ensureAdmin);

// Admin statistics
router.get("/stats", getAdminStats);

// User management
router.get("/users", getAllUsers);
router.post("/users/:userId/ban", banUser);
router.post("/users/:userId/unban", unbanUser);

// Content moderation
router.delete("/questions/:questionId", deleteQuestion);
router.delete("/answers/:answerId", deleteAnswer);

// Reports management
router.get("/reports", getAllReports);
router.post("/reports/:reportId/resolve", resolveReport);

module.exports = router;
