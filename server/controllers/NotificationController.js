const Notification = require("../models/Notification");
const User = require("../models/User");
const { convertToImageUrlStatic } = require("../utils/imageUtils");

// Helper function to process user data for response
const processUserData = (userData) => {
  if (!userData) return userData;

  const user = userData.toObject ? userData.toObject() : userData;
  return {
    ...user,
    profilePicture: user.profilePicture
      ? convertToImageUrlStatic(user.profilePicture)
      : null,
  };
};

class NotificationController {
  // Get all notifications for a user
  static async getUserNotifications(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, unreadOnly = false } = req.query;

      const query = { recipient: userId };
      if (unreadOnly === "true") {
        query.isRead = false;
      }

      const notifications = await Notification.find(query)
        .populate("sender", "name profilePicture")
        .populate("relatedQuestion", "title")
        .populate("relatedAnswer", "content")

        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const total = await Notification.countDocuments(query);

      // Process notifications to convert profile picture URLs
      const processedNotifications = notifications.map((notification) => {
        const notificationObj = notification.toObject();
        return {
          ...notificationObj,
          sender: processUserData(notificationObj.sender),
        };
      });

      res.json({
        notifications: processedNotifications,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Error fetching notifications" });
    }
  }

  // Mark notification as read
  static async markAsRead(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;

      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { isRead: true, readAt: new Date() },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      res.json({ message: "Notification marked as read", notification });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Error marking notification as read" });
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;

      await Notification.updateMany(
        { recipient: userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res
        .status(500)
        .json({ message: "Error marking all notifications as read" });
    }
  }

  // Get unread notification count
  static async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;

      const count = await Notification.countDocuments({
        recipient: userId,
        isRead: false,
      });

      res.json({ unreadCount: count });
    } catch (error) {
      console.error("Error getting unread count:", error);
      res.status(500).json({ message: "Error getting unread count" });
    }
  }

  // Create a notification (utility method for other controllers)
  static async createNotification(notificationData) {
    try {
      const notification = new Notification(notificationData);
      await notification.save();
      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  // Delete a notification
  static async deleteNotification(req, res) {
    try {
      const { notificationId } = req.params;
      const userId = req.user.id;

      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: userId,
      });

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      res.json({ message: "Notification deleted successfully" });
    } catch (error) {
      console.error("Error deleting notification:", error);
      res.status(500).json({ message: "Error deleting notification" });
    }
  }
}

module.exports = NotificationController;
