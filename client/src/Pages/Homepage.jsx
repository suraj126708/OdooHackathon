import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Home,
  User,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Eye,
  Calendar,
  Tag,
  ArrowUp,
  ArrowDown,
  Check,
  Edit,
  Trash2,
  Flag,
  Plus,
} from "lucide-react";
import axios from "../Authorisation/axiosConfig";
import { handleSuccess, handleError } from "../utils";
import { AuthContext } from "../Authorisation/AuthProvider";

const Homepage = () => {
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useContext(AuthContext);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    newest: true,
    unanswered: false,
    active: false,
    votes: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [userVotes, setUserVotes] = useState({});
  const [popularTags, setPopularTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    fetchQuestions();
    fetchPopularTags();
  }, [currentPage, filters, searchTerm, selectedTag]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        search: searchTerm,
        filter: getActiveFilter(),
      });

      if (selectedTag) {
        params.append("tag", selectedTag);
      }

      const response = await axios.get(`/api/questions?${params}`);

      if (response.data.success) {
        setQuestions(response.data.data);
        console.log(response.data.data[0].author.profilePicture);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularTags = async () => {
    try {
      const response = await axios.get("/api/questions/tags");
      if (response.data.success) {
        setPopularTags(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const getActiveFilter = () => {
    if (filters.unanswered) return "unanswered";
    if (filters.active) return "active";
    if (filters.votes) return "votes";
    return "newest";
  };

  const handleVote = async (questionId, answerId, voteType) => {
    if (!currentUser) {
      handleError("Please login to vote");
      return;
    }

    try {
      const response = await axios.post("/api/questions/vote", {
        targetType: answerId ? "answer" : "question",
        targetId: answerId || questionId,
        voteType,
      });

      if (response.data.success) {
        // Update the question/answer vote count
        setQuestions((prevQuestions) =>
          prevQuestions.map((question) => {
            if (question._id === questionId) {
              if (answerId) {
                // Update answer votes
                const updatedAnswers =
                  question.answers?.map((answer) =>
                    answer._id === answerId
                      ? { ...answer, ...response.data.data }
                      : answer
                  ) || [];
                return { ...question, answers: updatedAnswers };
              } else {
                // Update question votes
                return { ...question, ...response.data.data };
              }
            }
            return question;
          })
        );

        // Update local vote state
        const voteKey = `${questionId}-${answerId || "question"}-${voteType}`;
        setUserVotes((prev) => ({
          ...prev,
          [voteKey]: !prev[voteKey],
        }));
      }
    } catch (error) {
      console.error("Error voting:", error);
      handleError("Failed to record vote");
    }
  };

  const toggleQuestionExpansion = (questionId) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays < 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleFilterChange = (filterName) => {
    setFilters((prev) => ({
      newest: false,
      unanswered: false,
      active: false,
      votes: false,
      [filterName]: true,
    }));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleTagClick = (tagName) => {
    setSelectedTag(selectedTag === tagName ? "" : tagName);
    setCurrentPage(1);
  };

  const VoteButtons = ({ votes, questionId, answerId, isVertical = true }) => {
    const upvoteKey = `${questionId}-${answerId || "question"}-upvote`;
    const downvoteKey = `${questionId}-${answerId || "question"}-downvote`;

    return (
      <div
        className={`flex ${
          isVertical ? "flex-col" : "flex-row"
        } items-center gap-1`}
      >
        <button
          onClick={() => handleVote(questionId, answerId, "upvote")}
          className={`p-1 rounded hover:bg-gray-100 transition-colors ${
            userVotes[upvoteKey]
              ? "text-green-600 bg-green-50"
              : "text-gray-500"
          }`}
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-gray-700">{votes}</span>
        <button
          onClick={() => handleVote(questionId, answerId, "downvote")}
          className={`p-1 rounded hover:bg-gray-100 transition-colors ${
            userVotes[downvoteKey] ? "text-red-600 bg-red-50" : "text-gray-500"
          }`}
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>
    );
  };

  if (loading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-4">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Filters</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="filter"
                    checked={filters.newest}
                    onChange={() => handleFilterChange("newest")}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Newest</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="filter"
                    checked={filters.unanswered}
                    onChange={() => handleFilterChange("unanswered")}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Unanswered</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="filter"
                    checked={filters.active}
                    onChange={() => handleFilterChange("active")}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="filter"
                    checked={filters.votes}
                    onChange={() => handleFilterChange("votes")}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Most Voted</span>
                </label>
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.slice(0, 10).map((tag) => (
                  <button
                    key={tag._id}
                    onClick={() => handleTagClick(tag.name)}
                    className={`text-xs px-2 py-1 rounded-full transition-colors ${
                      selectedTag === tag.name
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            {currentUser && (
              <button
                onClick={() => navigate("/ask-question")}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ask Question
              </button>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {questions.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500">No questions found.</p>
                  {currentUser && (
                    <button
                      onClick={() => navigate("/ask-question")}
                      className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Ask the first question
                    </button>
                  )}
                </div>
              ) : (
                questions.map((question) => (
                  <div
                    key={question._id}
                    className="bg-white rounded-lg shadow p-6"
                  >
                    <div className="flex gap-4">
                      {/* Vote Section */}
                      <VoteButtons
                        votes={question.totalVotes}
                        questionId={question._id}
                      />

                      {/* Question Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <Link
                            to={`/question/${question._id}`}
                            className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer"
                          >
                            {question.title}
                          </Link>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Eye className="w-4 h-4" />
                            {question.views}
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {question.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {question.tags?.map((tag) => (
                            <span
                              key={tag._id}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>

                        {/* Meta Information */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {question.answerCount || 0} answers
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(question.createdAt)}
                            </span>
                            {question.hasAcceptedAnswer && (
                              <span className="flex items-center gap-1 text-green-600">
                                <Check className="w-4 h-4" />
                                Answered
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                question.author?.profilePicture ||
                                "https://tse4.mm.bing.net/th/id/OIP.l54ICAiwopa2RCt7J2URWwHaHa?pid=Api&P=0&h=180"
                              }
                              alt={question.author?.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <span>{question.author?.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    &gt;
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
