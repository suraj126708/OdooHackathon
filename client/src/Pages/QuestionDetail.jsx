import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getQuestion,
  createAnswer,
  vote,
  acceptAnswer,
} from "../services/questionService";
import { Home, User, ArrowLeft, Check, ArrowUp, ArrowDown } from "lucide-react";
import RichTextEditor from "../components/RichTextEditor";
import MarkdownRenderer from "../components/MarkdownRenderer";
import axios from "../Authorisation/axiosConfig";

import { AuthContext } from "../Authorisation/AuthProvider";

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answerContent, setAnswerContent] = useState("");
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [userVotes, setUserVotes] = useState({});
  const [isAcceptingAnswer, setIsAcceptingAnswer] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const response = await getQuestion(id);
        if (response.success) {
          setQuestion(response.data.question);
          setAnswers(response.data.answers);
        } else {
          setError(response.message || "Failed to load question");
        }
      } catch (error) {
        console.error("Error fetching question:", error);
        setError("An error occurred while loading the question");
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/questions/users");
        if (response.data.success) {
          setAvailableUsers(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    if (id) {
      fetchQuestion();
      fetchUsers();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Question not found</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();

    if (!answerContent.trim()) {
      return;
    }
    setIsSubmittingAnswer(true);
    try {
      const response = await createAnswer(id, { content: answerContent });

      if (response.success) {
        // Add the new answer to the list
        setAnswers((prev) => [response.data, ...prev]);
        setAnswerContent("");
        setShowAnswerForm(false);

        // Refresh the question to get updated answer count
        const questionResponse = await getQuestion(id);
        if (questionResponse.success) {
          setQuestion(questionResponse.data.question);
        }
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      setError("Failed to submit answer. Please try again.");
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  const handleVote = async (targetType, targetId, voteType) => {
    if (!isAuthenticated) {
      setError("Please log in to vote");
      return;
    }

    try {
      const response = await vote({
        targetType,
        targetId,
        voteType,
      });

      if (response.success) {
        if (targetType === "question") {
          // Update question votes
          setQuestion((prev) => ({
            ...prev,
            upvotes: response.data.upvotes,
            downvotes: response.data.downvotes,
            totalVotes: response.data.totalVotes,
          }));
        } else {
          // Update answer votes
          setAnswers((prev) =>
            prev.map((answer) =>
              answer._id === targetId
                ? {
                    ...answer,
                    upvotes: response.data.upvotes,
                    downvotes: response.data.downvotes,
                    totalVotes: response.data.totalVotes,
                  }
                : answer
            )
          );
        }

        // Update local vote state
        const voteKey = `${targetType}-${targetId}-${voteType}`;
        setUserVotes((prev) => ({
          ...prev,
          [voteKey]: !prev[voteKey],
        }));
      }
    } catch (error) {
      console.error("Error voting:", error);
      setError("Failed to record vote. Please try again.");
    }
  };

  const handleAcceptAnswer = async (answerId) => {
    if (!isAuthenticated) {
      setError("Please log in to accept answers");
      return;
    }

    if (question.author._id !== user?._id) {
      setError("Only the question author can accept answers");
      return;
    }

    setIsAcceptingAnswer(true);
    try {
      const response = await acceptAnswer(id, answerId);

      if (response.success) {
        // Update the accepted answer in the list
        setAnswers((prev) =>
          prev.map((answer) => ({
            ...answer,
            isAccepted: answer._id === answerId,
            acceptedAt: answer._id === answerId ? new Date() : null,
          }))
        );

        // Update question's accepted answer
        setQuestion((prev) => ({
          ...prev,
          acceptedAnswer: answerId,
        }));
      }
    } catch (error) {
      console.error("Error accepting answer:", error);
      setError("Failed to accept answer. Please try again.");
    } finally {
      setIsAcceptingAnswer(false);
    }
  };

  // Handle user mention from RichTextEditor
  const handleMention = (user) => {
    console.log(`Mentioned user: ${user.username}`);
    // You can add additional logic here like notifications, etc.
  };

  const VoteButtons = ({ targetType, targetId, votes, isVertical = true }) => {
    const upvoteKey = `${targetType}-${targetId}-upvote`;
    const downvoteKey = `${targetType}-${targetId}-downvote`;

    return (
      <div
        className={`flex ${
          isVertical ? "flex-col" : "flex-row"
        } items-center gap-1`}
      >
        <button
          onClick={() => handleVote(targetType, targetId, "upvote")}
          className={`p-1 rounded hover:bg-gray-100 transition-colors ${
            userVotes[upvoteKey]
              ? "text-green-600 bg-green-50"
              : "text-gray-500"
          }`}
          disabled={!isAuthenticated}
        >
          <ArrowUp className="w-4 h-4" />
        </button>
        <span className="text-sm font-medium text-gray-700">{votes}</span>
        <button
          onClick={() => handleVote(targetType, targetId, "downvote")}
          className={`p-1 rounded hover:bg-gray-100 transition-colors ${
            userVotes[downvoteKey] ? "text-red-600 bg-red-50" : "text-gray-500"
          }`}
          disabled={!isAuthenticated}
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setError("")}
              className="mt-2 text-red-500 hover:text-red-700 text-sm"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Question */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start space-x-4">
            {/* Vote buttons */}
            <VoteButtons
              targetType="question"
              targetId={question._id}
              votes={question.totalVotes || 0}
            />

            {/* Question content */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                {question.title}
              </h1>

              <div className="prose max-w-none mb-4">
                <MarkdownRenderer content={question.description} />
              </div>

              {/* Tags */}
              {question.tags && question.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {tag.name || tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Question meta */}
              <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                <div className="flex items-center space-x-4">
                  <span>
                    Asked {new Date(question.createdAt).toLocaleDateString()}
                  </span>
                  <span>{question.views || 0} views</span>
                </div>

                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>
                    {question.author?.name ||
                      question.author?.username ||
                      "Anonymous"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answers */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {answers.length} Answer{answers.length !== 1 ? "s" : ""}
            </h2>

            {isAuthenticated && (
              <button
                onClick={() => setShowAnswerForm(!showAnswerForm)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {showAnswerForm ? "Cancel" : "Post Answer"}
              </button>
            )}
          </div>

          {/* Answer Form */}
          {showAnswerForm && isAuthenticated && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Your Answer
              </h3>
              <form onSubmit={handleSubmitAnswer}>
                <RichTextEditor
                  value={answerContent}
                  onChange={setAnswerContent}
                  placeholder="Write your answer here. Be clear and provide helpful information... Type @ to mention users."
                  rows={8}
                  onMention={handleMention}
                  availableUsers={availableUsers}
                />
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAnswerForm(false);
                      setAnswerContent("");
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingAnswer || !answerContent.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmittingAnswer ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Posting...
                      </>
                    ) : (
                      "Post Answer"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Login Prompt */}
          {!isAuthenticated && (
            <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
              <p className="text-blue-800 mb-3">
                Please log in to post an answer to this question.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Log In
              </button>
            </div>
          )}

          {answers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No answers yet. Be the first to answer this question!
            </p>
          ) : (
            <div className="space-y-6">
              {answers.map((answer) => (
                <div
                  key={answer._id}
                  className={`border-b pb-6 last:border-b-0 ${
                    answer.isAccepted ? "bg-green-50 border-green-200" : ""
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Vote buttons */}
                    <VoteButtons
                      targetType="answer"
                      targetId={answer._id}
                      votes={answer.totalVotes || 0}
                    />

                    {/* Answer content */}
                    <div className="flex-1">
                      {/* Accepted answer badge */}
                      {answer.isAccepted && (
                        <div className="flex items-center gap-2 mb-3">
                          <Check className="w-5 h-5 text-green-600" />
                          <span className="text-green-600 font-semibold">
                            Accepted Answer
                          </span>
                        </div>
                      )}

                      <div className="mb-4">
                        <MarkdownRenderer content={answer.content} />
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>
                            Answered{" "}
                            {new Date(answer.createdAt).toLocaleDateString()}
                          </span>
                          {answer.isAccepted && (
                            <span className="text-green-600">
                              Accepted{" "}
                              {new Date(answer.acceptedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>
                              {answer.author?.name ||
                                answer.author?.username ||
                                "Anonymous"}
                            </span>
                          </div>

                          {/* Accept answer button - only show to question author */}
                          {isAuthenticated &&
                            question.author._id === user?._id &&
                            !answer.isAccepted && (
                              <button
                                onClick={() => handleAcceptAnswer(answer._id)}
                                disabled={isAcceptingAnswer}
                                className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Check className="w-4 h-4" />
                                {isAcceptingAnswer ? "Accepting..." : "Accept"}
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
