import axiosInstance from "../Authorisation/axiosConfig";

class NotificationService {
  // Get user notifications
  static async getNotifications(page = 1, limit = 10, unreadOnly = false) {
    try {
      const response = await axiosInstance.get("/api/notifications", {
        params: { page, limit, unreadOnly },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }

  // Get unread notification count
  static async getUnreadCount() {
    try {
      const response = await axiosInstance.get(
        "/api/notifications/unread-count"
      );
      return response.data.unreadCount;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId) {
    try {
      const response = await axiosInstance.patch(
        `/api/notifications/${notificationId}/read`
      );
      return response.data;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  // Mark all notifications as read
  static async markAllAsRead() {
    try {
      const response = await axiosInstance.patch(
        "/api/notifications/mark-all-read"
      );
      return response.data;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  // Delete a notification
  static async deleteNotification(notificationId) {
    try {
      const response = await axiosInstance.delete(
        `/api/notifications/${notificationId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }
}

export default NotificationService;
