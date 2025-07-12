import React, { useState, useEffect } from "react";
import { useAuth } from "../Authorisation/AuthProvider";
import { Link } from "react-router-dom";
import axiosInstance from "../Authorisation/axiosConfig";
import AdminUserManagement from "../components/AdminUserManagement";
import {
  FaUsers,
  FaQuestionCircle,
  FaComments,
  FaExclamationTriangle,
  FaUserCog,
  FaCog,
  FaShieldAlt,
  FaTrash,
  FaBan,
  FaCheckCircle,
  FaFlag,
} from "react-icons/fa";

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalQuestions: 0,
    totalAnswers: 0,
    pendingReports: 0,
    bannedUsers: 0,
  });
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      console.log("Fetching admin data...");

      // Fetch admin statistics
      console.log("Calling /api/admin/stats...");
      const statsResponse = await axiosInstance.get("/api/admin/stats");
      console.log("Stats response:", statsResponse.data);
      setStats(statsResponse.data);

      // Fetch recent questions
      console.log("Calling /api/questions...");
      const questionsResponse = await axiosInstance.get(
        "/api/questions?limit=5"
      );
      console.log("Questions response:", questionsResponse.data);
      setRecentQuestions(questionsResponse.data.data || []);

      // Fetch recent users
      console.log("Calling /api/admin/users...");
      const usersResponse = await axiosInstance.get("/api/admin/users?limit=5");
      console.log("Users response:", usersResponse.data);
      setRecentUsers(usersResponse.data.users || []);

      // Fetch recent reports
      console.log("Calling /api/admin/reports...");
      const reportsResponse = await axiosInstance.get(
        "/api/admin/reports?limit=5"
      );
      console.log("Reports response:", reportsResponse.data);
      setReports(reportsResponse.data.reports || []);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, reason) => {
    try {
      await axiosInstance.post(`/api/admin/users/${userId}/ban`, { reason });
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error("Error banning user:", error);
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await axiosInstance.post(`/api/admin/users/${userId}/unban`);
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error("Error unbanning user:", error);
    }
  };

  const handleResolveReport = async (reportId, action) => {
    try {
      await axiosInstance.post(`/api/admin/reports/${reportId}/resolve`, {
        action,
      });
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error("Error resolving report:", error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await axiosInstance.delete(`/api/admin/questions/${questionId}`);
        fetchAdminData(); // Refresh data
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (window.confirm("Are you sure you want to delete this answer?")) {
      try {
        await axiosInstance.delete(`/api/admin/answers/${answerId}`);
        fetchAdminData(); // Refresh data
      } catch (error) {
        console.error("Error deleting answer:", error);
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaShieldAlt className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You don't have permission to access the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
              </div>
              <div className="flex items-center space-x-4">
                <FaShieldAlt className="text-4xl text-blue-600" />
                <div className="text-right">
                  <p className="text-sm text-gray-500">Admin Level</p>
                  <p className="text-lg font-semibold text-gray-900">
                    Super Admin
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <FaUsers className="text-3xl text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalUsers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <FaQuestionCircle className="text-3xl text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Questions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalQuestions}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <FaComments className="text-3xl text-purple-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Answers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalAnswers}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <FaFlag className="text-3xl text-red-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Pending Reports</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingReports}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <FaBan className="text-3xl text-orange-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-500">Banned Users</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.bannedUsers}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "users"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => setActiveTab("content")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "content"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Content Moderation
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "reports"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Reports ({stats.pendingReports})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Questions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recent Questions
                    </h3>
                    <div className="space-y-3">
                      {recentQuestions.map((question) => (
                        <div
                          key={question._id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Link
                                to={`/question/${question._id}`}
                                className="text-sm font-medium text-gray-900 hover:text-blue-600"
                              >
                                {question.title}
                              </Link>
                              <p className="text-xs text-gray-500 mt-1">
                                by {question.author?.name} •{" "}
                                {new Date(
                                  question.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleDeleteQuestion(question._id)
                                }
                                className="text-red-600 hover:text-red-800"
                                title="Delete Question"
                              >
                                <FaTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Users */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recent Users
                    </h3>
                    <div className="space-y-3">
                      {recentUsers.map((user) => (
                        <div
                          key={user._id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <img
                                src={
                                  user.profilePicture ||
                                  "https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                                }
                                alt={user.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {user.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  @{user.username}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {user.isBanned ? (
                                <button
                                  onClick={() => handleUnbanUser(user._id)}
                                  className="text-green-600 hover:text-green-800"
                                  title="Unban User"
                                >
                                  <FaCheckCircle className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleBanUser(user._id, "Admin action")
                                  }
                                  className="text-red-600 hover:text-red-800"
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
                  </div>
                </div>
              </div>
            )}

            {activeTab === "users" && <AdminUserManagement />}

            {activeTab === "content" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Content Moderation
                </h3>
                <p className="text-gray-600">
                  Content moderation features will be implemented here.
                </p>
              </div>
            )}

            {activeTab === "reports" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Reports
                </h3>
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div
                      key={report._id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <FaExclamationTriangle className="text-red-500" />
                            <span className="text-sm font-medium text-gray-900">
                              {report.reason} - {report.targetType}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {report.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            Reported by {report.reporter?.name} on{" "}
                            {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleResolveReport(report._id, "dismiss")
                            }
                            className="text-gray-600 hover:text-gray-800"
                            title="Dismiss Report"
                          >
                            <FaTimes className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleResolveReport(report._id, "remove")
                            }
                            className="text-red-600 hover:text-red-800"
                            title="Remove Content"
                          >
                            <FaTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
