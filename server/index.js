const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const path = require("path");

const AuthRouter = require("./routes/AuthRouter");
const QuestionRouter = require("./routes/QuestionRouter");
const NotificationRouter = require("./routes/NotificationRouter");
const AdminRouter = require("./routes/AdminRouter");

const app = express();
require("dotenv").config();
const connectDB = require("./models/db");

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// CORS configuration
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", AuthRouter);
app.use("/api/questions", QuestionRouter);
app.use("/api/notifications", NotificationRouter);
app.use("/api/admin", AdminRouter);

// Health check endpoint
app.get("/ping", (req, res) => {
  res.json({
    message: "Server is running",
    timestamp: new Date().toISOString(),
    status: "healthy",
  });
});

// API Documentation endpoint
app.get("/api", (req, res) => {
  res.json({
    message: "Odoo Hackathon API",
    version: "1.0.0",
    endpoints: {
      auth: {
        "POST /api/auth/signup": "Register a new user",
        "POST /api/auth/login": "Login user",
        "GET /api/auth/profile": "Get user profile (protected)",
        "PUT /api/auth/profile": "Update user profile (protected)",
        "POST /api/auth/logout": "Logout user (protected)",
        "GET /api/auth/verify": "Verify JWT token (protected)",
      },
      questions: {
        "GET /api/questions": "Get all questions with filters and pagination",
        "GET /api/questions/:id": "Get single question with answers",
        "POST /api/questions": "Create new question (protected)",
        "POST /api/questions/:questionId/answers":
          "Create new answer to a question (protected)",
        "POST /api/questions/:questionId/answers/:answerId/accept":
          "Accept an answer to a question (protected, question author only)",
        "POST /api/questions/vote": "Vote on question/answer (protected)",
        "GET /api/questions/tags": "Get popular tags",
      },
      notifications: {
        "GET /api/notifications": "Get user notifications (protected)",
        "GET /api/notifications/unread-count":
          "Get unread notification count (protected)",
        "PATCH /api/notifications/:notificationId/read":
          "Mark notification as read (protected)",
        "PATCH /api/notifications/mark-all-read":
          "Mark all notifications as read (protected)",
        "DELETE /api/notifications/:notificationId":
          "Delete notification (protected)",
      },
      admin: {
        "GET /api/admin/stats": "Get admin statistics (admin only)",
        "GET /api/admin/users": "Get all users (admin only)",
        "POST /api/admin/users/:userId/ban": "Ban user (admin only)",
        "POST /api/admin/users/:userId/unban": "Unban user (admin only)",
        "DELETE /api/admin/questions/:questionId":
          "Delete question (admin only)",
        "DELETE /api/admin/answers/:answerId": "Delete answer (admin only)",
        "GET /api/admin/reports": "Get all reports (admin only)",
        "POST /api/admin/reports/:reportId/resolve":
          "Resolve report (admin only)",
      },
      health: {
        "GET /ping": "Health check",
      },
    },
    documentation: "API documentation will be available here",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    success: false,
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);

  // Handle multer errors
  if (err.name === "MulterError") {
    return res.status(400).json({
      message: "File upload error",
      success: false,
      error: err.message,
    });
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation error",
      success: false,
      error: err.message,
    });
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Invalid token",
      success: false,
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Token expired",
      success: false,
    });
  }

  // Default error
  res.status(500).json({
    message: "Internal server error",
    success: false,
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/ping`);
});
