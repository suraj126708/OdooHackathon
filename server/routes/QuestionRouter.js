const {
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
} = require("../controllers/QuestionController");

const ensureAuthenticated = require("../middlewares/Auth");
const upload = require("../models/fileUpload");

const router = require("express").Router();

// Public routes - specific routes first
router.get("/tags", getPopularTags);
router.get("/user/:userId", getUserQuestions);
router.get("/answers/user/:userId", getUserAnswers);
router.get("/", getQuestions);

// Protected routes
router.post(
  "/",
  ensureAuthenticated,
  upload.array("images", 5),
  createQuestion
);
router.post("/vote", ensureAuthenticated, vote);

// Edit and delete routes
router.put("/:id", ensureAuthenticated, editQuestion);
router.delete("/:id", ensureAuthenticated, deleteQuestion);
router.put("/answers/:answerId", ensureAuthenticated, editAnswer);
router.delete("/answers/:answerId", ensureAuthenticated, deleteAnswer);

// More specific routes should come before general ones
router.post(
  "/:questionId/answers/:answerId/accept",
  ensureAuthenticated,
  acceptAnswer
);
router.post("/:questionId/answers", ensureAuthenticated, createAnswer);
router.get("/:id", getQuestion);

module.exports = router;
