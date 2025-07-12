import React, { useState, useEffect, useContext } from "react";
import { useAuth } from "../Authorisation/AuthProvider";
import {
  getUserQuestions,
  getUserAnswers,
  deleteQuestion,
  deleteAnswer,
} from "../services/questionService";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../Authorisation/axiosConfig";
import EditQuestion from "../components/EditQuestion";
import EditAnswer from "../components/EditAnswer";
import { toast } from "react-toastify";
import {
  FaUser,
  FaCalendarAlt,
  FaQuestionCircle,
  FaComments,
  FaCheckCircle,
  FaThumbsUp,
  FaEdit,
  FaEye,
  FaTag,
  FaReply,
  FaTrash,
} from "react-icons/fa";
import MarkdownRenderer from "../components/MarkdownRenderer";

const ProfilePage = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [userQuestions, setUserQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingAnswer, setEditingAnswer] = useState(null);

  useEffect(() => {
    if (authUser?._id) {
      fetchUserProfile();
      fetchUserQuestions();
    }
  }, [authUser, currentPage]);

  const fetchUserProfile = async () => {
    try {
      console.log("Fetching user profile for user ID:", authUser._id);
      const response = await axiosInstance.get("/api/auth/profile");
      console.log("Profile response:", response.data);
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      console.log("Falling back to auth user data:", authUser);
      // Fallback to auth user data
      setUser(authUser);
    }
  };

  const fetchUserQuestions = async () => {
    try {
      setLoading(true);
      console.log("Fetching questions for user ID:", authUser._id);
      const response = await getUserQuestions(authUser._id, {
        page: currentPage,
        limit: 5,
      });
      console.log("Questions response:", response);
      console.log("Questions data:", response.data);
      console.log("Questions array length:", response.data?.length);
      console.log("Questions array:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setUserQuestions(response.data);
      } else {
        console.log("No questions data or invalid format, setting empty array");
        setUserQuestions([]);
      }

      setTotalPages(response.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching user questions:", error);
      console.error("Error details:", error.response?.data);
      console.error("Error status:", error.response?.status);
      setUserQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAnswers = async () => {
    try {
      setLoading(true);
      const response = await getUserAnswers(authUser._id, {
        page: 1,
        limit: 10,
      });
      console.log("Answers response:", response);
      setUserAnswers(response.data || []);
    } catch (error) {
      console.error("Error fetching user answers:", error);
      setUserAnswers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "answers") {
      fetchUserAnswers();
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this question? This action cannot be undone."
      )
    ) {
      try {
        await deleteQuestion(questionId);
        toast.success("Question deleted successfully!");
        fetchUserQuestions(); // Refresh the questions list
      } catch (error) {
        console.error("Error deleting question:", error);
        toast.error(error.response?.data?.message || "Error deleting question");
      }
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this answer? This action cannot be undone."
      )
    ) {
      try {
        await deleteAnswer(answerId);
        toast.success("Answer deleted successfully!");
        fetchUserAnswers(); // Refresh the answers list
      } catch (error) {
        console.error("Error deleting answer:", error);
        toast.error(error.response?.data?.message || "Error deleting answer");
      }
    }
  };

  const handleQuestionUpdate = (updatedQuestion) => {
    setUserQuestions((prev) =>
      prev.map((q) => (q._id === updatedQuestion._id ? updatedQuestion : q))
    );
  };

  const handleAnswerUpdate = (updatedAnswer) => {
    setUserAnswers((prev) =>
      prev.map((a) => (a._id === updatedAnswer._id ? updatedAnswer : a))
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const getReputationColor = (reputation) => {
    if (reputation >= 1000) return "text-green-600";
    if (reputation >= 500) return "text-blue-600";
    if (reputation >= 100) return "text-yellow-600";
    return "text-gray-600";
  };

  const getReputationBadge = (reputation) => {
    if (reputation >= 1000) return "Expert";
    if (reputation >= 500) return "Advanced";
    if (reputation >= 100) return "Intermediate";
    return "Beginner";
  };

  // Use user from state or fallback to auth user
  const currentUser = user || authUser;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Profile Picture */}
              <div className="relative">
                <img
                  src={
                    currentUser.profilePicture ||
                    "https://flowbite.com/docs/images/people/profile-picture-3.jpg"
                  }
                  alt={currentUser.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {currentUser.name}
                    </h1>
                    <p className="text-gray-600 mt-1">
                      @{currentUser.username}
                    </p>
                    {currentUser.bio && (
                      <p className="text-gray-700 mt-2 max-w-2xl">
                        {currentUser.bio}
                      </p>
                    )}
                  </div>

                  {/* Edit Profile Button */}
                  <button className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <FaEdit className="mr-2" />
                    Edit Profile
                  </button>
                </div>

                {/* User Stats */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {currentUser.questionsAsked || 0}
                    </div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {currentUser.answersGiven || 0}
                    </div>
                    <div className="text-sm text-gray-600">Answers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {currentUser.acceptedAnswers || 0}
                    </div>
                    <div className="text-sm text-gray-600">Accepted</div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold ${getReputationColor(
                        currentUser.reputation || 0
                      )}`}
                    >
                      {currentUser.reputation || 0}
                    </div>
                    <div className="text-sm text-gray-600">Reputation</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="mr-2" />
                  <span>Joined {formatJoinDate(currentUser.joinDate)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaUser className="mr-2" />
                  <span>Role: {currentUser.role}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaThumbsUp className="mr-2" />
                  <span>
                    Level: {getReputationBadge(currentUser.reputation || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => handleTabChange("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => handleTabChange("questions")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "questions"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Questions ({currentUser.questionsAsked || 0})
              </button>
              <button
                onClick={() => handleTabChange("answers")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "answers"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Answers ({currentUser.answersGiven || 0})
              </button>
              <button
                onClick={() => handleTabChange("activity")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "activity"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Activity
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Reputation Card */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Reputation
                        </h3>
                        <p
                          className={`text-3xl font-bold ${getReputationColor(
                            currentUser.reputation || 0
                          )}`}
                        >
                          {currentUser.reputation || 0}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {getReputationBadge(currentUser.reputation || 0)}{" "}
                          Level
                        </p>
                      </div>
                      <div className="text-4xl text-blue-500">
                        <FaThumbsUp />
                      </div>
                    </div>
                  </div>

                  {/* Activity Summary */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Activity
                        </h3>
                        <p className="text-3xl font-bold text-green-600">
                          {(currentUser.questionsAsked || 0) +
                            (currentUser.answersGiven || 0)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Total Contributions
                        </p>
                      </div>
                      <div className="text-4xl text-green-500">
                        <FaQuestionCircle />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Activity
                  </h3>
                  {userQuestions.length > 0 ? (
                    <div className="space-y-3">
                      {userQuestions.slice(0, 3).map((question) => (
                        <div
                          key={question._id}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <FaQuestionCircle className="text-blue-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <Link
                              to={`/question/${question._id}`}
                              className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block"
                            >
                              {question.title}
                            </Link>
                            <p className="text-xs text-gray-500">
                              {formatDate(question.createdAt)} •{" "}
                              {question.answerCount || 0} answers
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No recent activity
                    </p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "questions" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Your Questions
                  </h3>
                  <Link
                    to="/ask-question"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FaQuestionCircle className="mr-2" />
                    Ask New Question
                  </Link>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading questions...</p>
                  </div>
                ) : userQuestions.length > 0 ? (
                  <div className="space-y-4">
                    {userQuestions.map((question) => (
                      <div
                        key={question._id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link
                              to={`/question/${question._id}`}
                              className="text-lg font-semibold text-gray-900 hover:text-blue-600 block mb-2"
                            >
                              {question.title}
                            </Link>
                            <div className="text-gray-600 text-sm mb-3 line-clamp-2">
                              <MarkdownRenderer
                                content={
                                  question.description.substring(0, 150) + "..."
                                }
                              />
                            </div>

                            {/* Tags */}
                            {question.tags && question.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {question.tags.map((tag) => (
                                  <span
                                    key={tag._id}
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    <FaTag className="mr-1" />
                                    {tag.name}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Stats */}
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <span className="flex items-center">
                                <FaEye className="mr-1" />
                                {question.views || 0} views
                              </span>
                              <span className="flex items-center">
                                <FaComments className="mr-1" />
                                {question.answerCount || 0} answers
                              </span>
                              <span className="flex items-center">
                                <FaThumbsUp className="mr-1" />
                                {question.totalVotes || 0} votes
                              </span>
                              {question.hasAcceptedAnswer && (
                                <span className="flex items-center text-green-600">
                                  <FaCheckCircle className="mr-1" />
                                  Accepted
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => setEditingQuestion(question)}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
                              title="Edit Question"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(question._id)}
                              className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                              title="Delete Question"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            Asked on {formatDate(question.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center space-x-2 mt-6">
                        <button
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
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
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaQuestionCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No questions yet
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by asking your first question.
                    </p>
                    <div className="mt-6">
                      <Link
                        to="/ask-question"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FaQuestionCircle className="mr-2" />
                        Ask Your First Question
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "answers" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Your Answers
                  </h3>
                </div>

                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading answers...</p>
                  </div>
                ) : userAnswers.length > 0 ? (
                  <div className="space-y-4">
                    {userAnswers.map((answer) => (
                      <div
                        key={answer._id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link
                              to={`/question/${answer.question._id}`}
                              className="text-lg font-semibold text-gray-900 hover:text-blue-600 block mb-2"
                            >
                              {answer.question.title}
                            </Link>
                            <div className="text-gray-600 text-sm mb-3 line-clamp-2">
                              <MarkdownRenderer
                                content={
                                  answer.content.substring(0, 150) + "..."
                                }
                              />
                            </div>

                            {/* Stats */}
                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <span className="flex items-center">
                                <FaThumbsUp className="mr-1" />
                                {answer.totalVotes || 0} votes
                              </span>
                              {answer.isAccepted && (
                                <span className="flex items-center text-green-600">
                                  <FaCheckCircle className="mr-1" />
                                  Accepted Answer
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => setEditingAnswer(answer)}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50"
                              title="Edit Answer"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAnswer(answer._id)}
                              className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50"
                              title="Delete Answer"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            Answered on {formatDate(answer.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaReply className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No answers yet
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Start helping others by answering questions.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "activity" && (
              <div className="text-center py-12">
                <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Activity Timeline
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Your detailed activity timeline will be displayed here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modals */}
      {editingQuestion && (
        <EditQuestion
          question={editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onUpdate={handleQuestionUpdate}
        />
      )}

      {editingAnswer && (
        <EditAnswer
          answer={editingAnswer}
          onClose={() => setEditingAnswer(null)}
          onUpdate={handleAnswerUpdate}
        />
      )}
    </div>
  );
};

export default ProfilePage;
