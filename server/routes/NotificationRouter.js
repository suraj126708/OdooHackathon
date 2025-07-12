const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/NotificationController");
const AuthMiddleware = require("../middlewares/Auth");

// All routes require authentication
router.use(AuthMiddleware);

// Get user notifications
router.get("/", NotificationController.getUserNotifications);

// Get unread notification count
router.get("/unread-count", NotificationController.getUnreadCount);

// Mark notification as read
router.patch("/:notificationId/read", NotificationController.markAsRead);

// Mark all notifications as read
router.patch("/mark-all-read", NotificationController.markAllAsRead);

// Delete a notification
router.delete("/:notificationId", NotificationController.deleteNotification);

module.exports = router;
