import React, { useState, useEffect } from "react";
import { useAuth } from "../Authorisation/AuthProvider";
import NotificationService from "../services/notificationService";
import NotificationDropdown from "./NotificationDropdown";

const NotificationBell = () => {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnreadCount();
      // Set up polling for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchUnreadCount = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const count = await NotificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBellClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleNotificationRead = () => {
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={handleBellClick}
        className="relative p-2 text-white hover:bg-blue-700 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
        title="Notifications"
      >
        {/* Bell Icon */}
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-5 5v-5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>

        {/* Notification Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}

        {/* Loading Indicator */}
        {loading && unreadCount === 0 && (
          <span className="absolute -top-1 -right-1 bg-gray-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      <NotificationDropdown
        isOpen={isDropdownOpen}
        onClose={handleDropdownClose}
        unreadCount={unreadCount}
        onNotificationRead={handleNotificationRead}
      />
    </div>
  );
};

export default NotificationBell;
