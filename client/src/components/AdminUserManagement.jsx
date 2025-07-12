import React, { useState, useEffect } from "react";
import axiosInstance from "../Authorisation/axiosConfig";
import { toast } from "react-toastify";
import { FaCrown, FaUser, FaBan, FaCheckCircle, FaTimes } from "react-icons/fa";

const AdminUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `/api/admin/users?page=${currentPage}&limit=10`
      );
      setUsers(response.data.users || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteToAdmin = async (userId) => {
    try {
      await axiosInstance.post(`/api/auth/users/${userId}/promote`);
      toast.success("User promoted to admin successfully!");
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error promoting user:", error);
      toast.error(error.response?.data?.message || "Error promoting user");
    }
  };

  const handleDemoteFromAdmin = async (userId) => {
    try {
      await axiosInstance.post(`/api/auth/users/${userId}/demote`);
      toast.success("Admin demoted to user successfully!");
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error demoting admin:", error);
      toast.error(error.response?.data?.message || "Error demoting admin");
    }
  };

  const handleBanUser = async (userId) => {
    if (window.confirm("Are you sure you want to ban this user?")) {
      try {
        await axiosInstance.post(`/api/admin/users/${userId}/ban`, {
          reason: "Admin action",
        });
        toast.success("User banned successfully!");
        fetchUsers(); // Refresh the list
      } catch (error) {
        console.error("Error banning user:", error);
        toast.error(error.response?.data?.message || "Error banning user");
      }
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await axiosInstance.post(`/api/admin/users/${userId}/unban`);
      toast.success("User unbanned successfully!");
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error("Error unbanning user:", error);
      toast.error(error.response?.data?.message || "Error unbanning user");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        User Management
      </h3>

      <div className="space-y-4">
        {users.map((user) => (
          <div key={user._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={
                    user.profilePicture ||
                    "https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                  }
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    {user.role === "admin" && (
                      <FaCrown
                        className="text-yellow-500 w-4 h-4"
                        title="Admin"
                      />
                    )}
                    {user.isBanned && (
                      <FaBan className="text-red-500 w-4 h-4" title="Banned" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    @{user.username} • {user.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    Joined: {new Date(user.joinDate).toLocaleDateString()} •
                    Questions: {user.questionsAsked || 0} • Answers:{" "}
                    {user.answersGiven || 0}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                {/* Role Management */}
                {user.role === "admin" ? (
                  <button
                    onClick={() => handleDemoteFromAdmin(user._id)}
                    className="text-orange-600 hover:text-orange-800 p-2 rounded-full hover:bg-orange-50"
                    title="Demote from Admin"
                  >
                    <FaUser className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handlePromoteToAdmin(user._id)}
                    className="text-yellow-600 hover:text-yellow-800 p-2 rounded-full hover:bg-yellow-50"
                    title="Promote to Admin"
                  >
                    <FaCrown className="w-4 h-4" />
                  </button>
                )}

                {/* Ban/Unban */}
                {user.isBanned ? (
                  <button
                    onClick={() => handleUnbanUser(user._id)}
                    className="text-green-600 hover:text-green-800 p-2 rounded-full hover:bg-green-50"
                    title="Unban User"
                  >
                    <FaCheckCircle className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleBanUser(user._id)}
                    className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                    title="Ban User"
                  >
                    <FaBan className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-2 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;
