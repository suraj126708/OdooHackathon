const { Question, Answer, User, Tag, Vote } = require("../models");
const NotificationController = require("./NotificationController");
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

// Get all questions with pagination and filters
const getQuestions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      filter = "newest", // newest, unanswered, active, votes
      tag = "",
    } = req.query;

    const skip = (page - 1) * limit;

    // Build query
    let query = { isActive: true, isDeleted: false };

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Tag filter
    if (tag) {
      query.tags = tag;
    }

    // Filter options
    let sortOptions = {};
    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "unanswered":
        query.answerCount = 0;
        sortOptions = { createdAt: -1 };
        break;
      case "active":
        sortOptions = { updatedAt: -1 };
        break;
      case "votes":
        sortOptions = { totalVotes: -1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Get questions with populated author and tags
    const questions = await Question.find(query)
      .populate("author", "name username profilePicture")
      .populate("tags", "name color")
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Question.countDocuments(query);

    // Get answer counts for each question
    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const answerCount = await Answer.countDocuments({
          question: question._id,
          isActive: true,
          isDeleted: false,
        });

        const acceptedAnswer = await Answer.findOne({
          question: question._id,
          isAccepted: true,
          isActive: true,
          isDeleted: false,
        });

        const questionObj = question.toObject();
        return {
          ...questionObj,
          author: processUserData(questionObj.author),
          answerCount,
          hasAcceptedAnswer: !!acceptedAnswer,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: questionsWithAnswers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalQuestions: total,
        hasNextPage: skip + questions.length < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get Questions Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching questions",
    });
  }
};

// Get single question with answers
const getQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id)
      .populate("author", "name username profilePicture reputation")
      .populate("tags", "name color")
      .populate("acceptedAnswer");

    if (!question || !question.isActive || question.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Increment view count
    question.views += 1;
    await question.save();

    // Get answers for this question
    const answers = await Answer.find({
      question: id,
      isActive: true,
      isDeleted: false,
    })
      .populate("author", "name username profilePicture reputation")
      .sort({ isAccepted: -1, totalVotes: -1, createdAt: 1 });

    // Process user data for question and answers
    const questionObj = question.toObject();
    const processedQuestion = {
      ...questionObj,
      author: processUserData(questionObj.author),
    };

    const processedAnswers = answers.map((answer) => {
      const answerObj = answer.toObject();
      return {
        ...answerObj,
        author: processUserData(answerObj.author),
      };
    });

    res.status(200).json({
      success: true,
      data: {
        question: processedQuestion,
        answers: processedAnswers,
      },
    });
  } catch (error) {
    console.error("Get Question Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching question",
    });
  }
};

// Create new question
const createQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const userId = req.user._id;
    const uploadedFiles = req.files || [];

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    // Process uploaded images and update description
    let processedDescription = description;
    if (uploadedFiles.length > 0) {
      const imageUrls = uploadedFiles.map((file) => {
        const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
          file.filename
        }`;
        return imageUrl;
      });

      // Replace base64 image placeholders with actual URLs
      // This assumes the frontend sends base64 images in the description
      // and we replace them with actual uploaded URLs
      const base64Regex = /data:image\/[^;]+;base64,[^"]+/g;
      let imageIndex = 0;
      processedDescription = description.replace(base64Regex, (match) => {
        if (imageIndex < imageUrls.length) {
          return imageUrls[imageIndex++];
        }
        return match;
      });
    }

    // Create or find tags
    const tagIds = [];
    if (tags) {
      // Handle tags as JSON string from FormData
      let tagsArray = tags;
      if (typeof tags === "string") {
        try {
          tagsArray = JSON.parse(tags);
        } catch (error) {
          console.error("Error parsing tags:", error);
          tagsArray = [];
        }
      }

      if (Array.isArray(tagsArray) && tagsArray.length > 0) {
        for (const tagName of tagsArray) {
          let tag = await Tag.findOne({ name: tagName.toLowerCase() });
          if (!tag) {
            tag = new Tag({
              name: tagName.toLowerCase(),
              createdBy: userId,
            });
            await tag.save();
          }
          tagIds.push(tag._id);
        }
      }
    }

    // Create question
    const question = new Question({
      title,
      description: processedDescription,
      tags: tagIds,
      author: userId,
    });

    await question.save();

    // Update tag question counts
    for (const tagId of tagIds) {
      await Tag.findByIdAndUpdate(tagId, {
        $inc: { questionCount: 1 },
      });
    }

    // Update user's questions asked count
    await User.findByIdAndUpdate(userId, {
      $inc: { questionsAsked: 1 },
    });

    // Populate the question with author and tags
    const populatedQuestion = await Question.findById(question._id)
      .populate("author", "name username profilePicture")
      .populate("tags", "name color");

    res.status(201).json({
      success: true,
      message: "Question created successfully",
      data: populatedQuestion,
    });
  } catch (error) {
    console.error("Create Question Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating question",
    });
  }
};

// Create an answer to a question
const createAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Answer content is required",
      });
    }

    // Check if question exists and is active
    const question = await Question.findById(questionId);
    if (!question || !question.isActive || question.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Create the answer
    const answer = new Answer({
      content: content.trim(),
      question: questionId,
      author: userId,
    });

    await answer.save();

    // Update question's answer count
    question.answerCount += 1;
    await question.save();

    // Update user's answers given count
    await User.findByIdAndUpdate(userId, {
      $inc: { answersGiven: 1 },
    });

    // Create notification for question author (if not the same user)
    if (question.author.toString() !== userId.toString()) {
      try {
        await NotificationController.createNotification({
          recipient: question.author,
          sender: userId,
          type: "answer",
          message: `Someone answered your question "${question.title}"`,
          relatedQuestion: questionId,
          relatedAnswer: answer._id,
        });
      } catch (error) {
        console.error("Error creating answer notification:", error);
      }
    }

    // Populate author info for response
    await answer.populate("author", "name username profilePicture");

    // Process the answer data
    const answerObj = answer.toObject();
    const processedAnswer = {
      ...answerObj,
      author: processUserData(answerObj.author),
    };

    res.status(201).json({
      success: true,
      message: "Answer posted successfully",
      data: processedAnswer,
    });
  } catch (error) {
    console.error("Create Answer Error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating answer",
    });
  }
};

// Vote on question or answer
const vote = async (req, res) => {
  try {
    const { targetType, targetId, voteType } = req.body;
    const userId = req.user._id;

    // Validate vote type
    if (!["upvote", "downvote"].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vote type",
      });
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({
      user: userId,
      targetType,
      targetId,
    });

    let vote;
    if (existingVote) {
      // Update existing vote
      if (existingVote.voteType === voteType) {
        // Remove vote if same type
        await Vote.findByIdAndDelete(existingVote._id);
        vote = null;
      } else {
        // Change vote type
        existingVote.voteType = voteType;
        vote = await existingVote.save();
      }
    } else {
      // Create new vote
      vote = new Vote({
        user: userId,
        targetType,
        targetId,
        voteType,
      });
      await vote.save();
    }

    // Update target's vote count
    const Model = targetType === "question" ? Question : Answer;
    const target = await Model.findById(targetId);

    if (!target) {
      return res.status(404).json({
        success: false,
        message: `${targetType} not found`,
      });
    }

    // Recalculate votes
    const upvotes = await Vote.countDocuments({
      targetType,
      targetId,
      voteType: "upvote",
    });

    const downvotes = await Vote.countDocuments({
      targetType,
      targetId,
      voteType: "downvote",
    });

    target.upvotes = upvotes;
    target.downvotes = downvotes;
    target.totalVotes = upvotes - downvotes;
    await target.save();

    // Update user's total votes received if it's a question
    if (targetType === "question") {
      await User.findByIdAndUpdate(target.author, {
        $inc: {
          totalVotesReceived: vote
            ? voteType === "upvote"
              ? 1
              : -1
            : existingVote.voteType === "upvote"
            ? -1
            : 1,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: vote ? "Vote recorded" : "Vote removed",
      data: {
        upvotes: target.upvotes,
        downvotes: target.downvotes,
        totalVotes: target.totalVotes,
      },
    });
  } catch (error) {
    console.error("Vote Error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing vote",
    });
  }
};

// Accept an answer to a question
const acceptAnswer = async (req, res) => {
  try {
    const { questionId, answerId } = req.params;
    const userId = req.user._id;

    // Check if question exists and user is the author
    const question = await Question.findById(questionId);
    if (!question || !question.isActive || question.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    if (question.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Only the question author can accept answers",
      });
    }

    // Check if answer exists and belongs to this question
    const answer = await Answer.findById(answerId);
    if (
      !answer ||
      !answer.isActive ||
      answer.isDeleted ||
      answer.question.toString() !== questionId
    ) {
      return res.status(404).json({
        success: false,
        message: "Answer not found",
      });
    }

    // Check if there's already an accepted answer
    if (question.acceptedAnswer) {
      // Unaccept the current accepted answer
      const currentAcceptedAnswer = await Answer.findById(
        question.acceptedAnswer
      );
      if (currentAcceptedAnswer) {
        currentAcceptedAnswer.isAccepted = false;
        currentAcceptedAnswer.acceptedAt = null;
        await currentAcceptedAnswer.save();

        // Update the author's accepted answers count
        await User.findByIdAndUpdate(currentAcceptedAnswer.author, {
          $inc: { acceptedAnswers: -1 },
        });
      }
    }

    // Accept the new answer
    answer.isAccepted = true;
    answer.acceptedAt = new Date();
    await answer.save();

    // Update question's accepted answer
    question.acceptedAnswer = answerId;
    await question.save();

    // Update the answer author's accepted answers count
    await User.findByIdAndUpdate(answer.author, {
      $inc: { acceptedAnswers: 1 },
    });

    // Create notification for answer author
    try {
      await NotificationController.createNotification({
        recipient: answer.author,
        sender: userId,
        type: "accepted_answer",
        message: `Your answer was accepted for the question "${question.title}"`,
        relatedQuestion: questionId,
        relatedAnswer: answerId,
      });
    } catch (error) {
      console.error("Error creating accepted answer notification:", error);
    }

    // Populate the updated answer for response
    await answer.populate("author", "name username profilePicture reputation");

    // Process the answer data
    const answerObj = answer.toObject();
    const processedAnswer = {
      ...answerObj,
      author: processUserData(answerObj.author),
    };

    res.status(200).json({
      success: true,
      message: "Answer accepted successfully",
      data: processedAnswer,
    });
  } catch (error) {
    console.error("Accept Answer Error:", error);
    res.status(500).json({
      success: false,
      message: "Error accepting answer",
    });
  }
};

// Get popular tags
const getPopularTags = async (req, res) => {
  try {
    const tags = await Tag.find({ isActive: true })
      .sort({ questionCount: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error("Get Tags Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching tags",
    });
  }
};

// Get questions by user ID
const getUserQuestions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    // Get questions by user
    const questions = await Question.find({
      author: userId,
      isActive: true,
      isDeleted: false,
    })
      .populate("author", "name username profilePicture")
      .populate("tags", "name color")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Question.countDocuments({
      author: userId,
      isActive: true,
      isDeleted: false,
    });

    // Get answer counts for each question
    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const answerCount = await Answer.countDocuments({
          question: question._id,
          isActive: true,
          isDeleted: false,
        });

        const acceptedAnswer = await Answer.findOne({
          question: question._id,
          isAccepted: true,
          isActive: true,
          isDeleted: false,
        });

        const questionObj = question.toObject();
        return {
          ...questionObj,
          author: processUserData(questionObj.author),
          answerCount,
          hasAcceptedAnswer: !!acceptedAnswer,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: questionsWithAnswers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalQuestions: total,
        hasNextPage: skip + questions.length < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get User Questions Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user questions",
    });
  }
};

// Get answers by user ID
const getUserAnswers = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    // Get answers by user
    const answers = await Answer.find({
      author: userId,
      isActive: true,
      isDeleted: false,
    })
      .populate("author", "name username profilePicture")
      .populate("question", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Answer.countDocuments({
      author: userId,
      isActive: true,
      isDeleted: false,
    });

    // Process answer data
    const processedAnswers = answers.map((answer) => {
      const answerObj = answer.toObject();
      return {
        ...answerObj,
        author: processUserData(answerObj.author),
      };
    });

    res.status(200).json({
      success: true,
      data: processedAnswers,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalAnswers: total,
        hasNextPage: skip + answers.length < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get User Answers Error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user answers",
    });
  }
};

// Edit question
const editQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags } = req.body;
    const userId = req.user._id;

    // Find the question
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Check if user is the author or admin
    if (
      question.author.toString() !== userId.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own questions",
      });
    }

    // Update question fields
    if (title) question.title = title;
    if (description) question.description = description;
    question.updatedAt = new Date();

    // Handle tags if provided
    if (tags) {
      const tagIds = [];
      let tagsArray = tags;
      if (typeof tags === "string") {
        try {
          tagsArray = JSON.parse(tags);
        } catch (error) {
          console.error("Error parsing tags:", error);
          tagsArray = [];
        }
      }

      if (Array.isArray(tagsArray) && tagsArray.length > 0) {
        for (const tagName of tagsArray) {
          let tag = await Tag.findOne({ name: tagName.toLowerCase() });
          if (!tag) {
            tag = new Tag({
              name: tagName.toLowerCase(),
              createdBy: userId,
            });
            await tag.save();
          }
          tagIds.push(tag._id);
        }
      }
      question.tags = tagIds;
    }

    await question.save();

    // Populate the updated question
    const updatedQuestion = await Question.findById(id)
      .populate("author", "name username profilePicture")
      .populate("tags", "name color");

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
      data: updatedQuestion,
    });
  } catch (error) {
    console.error("Edit Question Error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating question",
    });
  }
};

// Delete question
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find the question
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Check if user is the author or admin
    if (
      question.author.toString() !== userId.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own questions",
      });
    }

    // Soft delete the question
    question.isDeleted = true;
    question.deletedBy = userId;
    question.deletedAt = new Date();
    await question.save();

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Delete Question Error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting question",
    });
  }
};

// Edit answer
const editAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    // Find the answer
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: "Answer not found",
      });
    }

    // Check if user is the author or admin
    if (
      answer.author.toString() !== userId.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own answers",
      });
    }

    // Update answer
    answer.content = content;
    answer.updatedAt = new Date();
    await answer.save();

    // Populate the updated answer
    await answer.populate("author", "name username profilePicture");

    res.status(200).json({
      success: true,
      message: "Answer updated successfully",
      data: answer,
    });
  } catch (error) {
    console.error("Edit Answer Error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating answer",
    });
  }
};

// Delete answer
const deleteAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const userId = req.user._id;

    // Find the answer
    const answer = await Answer.findById(answerId);
    if (!answer) {
      return res.status(404).json({
        success: false,
        message: "Answer not found",
      });
    }

    // Check if user is the author or admin
    if (
      answer.author.toString() !== userId.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own answers",
      });
    }

    // Soft delete the answer
    answer.isDeleted = true;
    answer.deletedBy = userId;
    answer.deletedAt = new Date();
    await answer.save();

    res.status(200).json({
      success: true,
      message: "Answer deleted successfully",
    });
  } catch (error) {
    console.error("Delete Answer Error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting answer",
    });
  }
};

module.exports = {
  getQuestions,
  getQuestion,
  createQuestion,
  createAnswer,
  vote,
  acceptAnswer,
  getPopularTags,
  getUserQuestions,
  getUserAnswers,
  editQuestion,
  deleteQuestion,
  editAnswer,
  deleteAnswer,
};
