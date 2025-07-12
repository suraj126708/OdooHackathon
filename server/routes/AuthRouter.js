const {
  signUp,
  login,
  getProfile,
  updateProfile,
  logout,
  promoteToAdmin,
  demoteFromAdmin,
} = require("../controllers/AuthController.js");

const {
  signUpValidation,
  loginValidation,
  updateProfileValidation,
} = require("../middlewares/AuthMiddleware");

const upload = require("../models/fileUpload");
const ensureAuthenticated = require("../middlewares/Auth");

const router = require("express").Router();

// Public routes
router.post(
  "/signup",
  upload.single("profilePicture"),
  signUpValidation,
  signUp
);

router.post("/login", loginValidation, login);

// Protected routes (require authentication)
router.get("/profile", ensureAuthenticated, getProfile);

router.put(
  "/profile",
  ensureAuthenticated,
  upload.single("profilePicture"),
  updateProfileValidation,
  updateProfile
);

router.post("/logout", ensureAuthenticated, logout);

// Token verification route
router.get("/verify", ensureAuthenticated, (req, res) => {
  res.json({
    message: "Token is valid",
    success: true,
    user: req.user,
  });
});

// Admin management routes (protected, admin only)
router.post("/users/:userId/promote", ensureAuthenticated, promoteToAdmin);
router.post("/users/:userId/demote", ensureAuthenticated, demoteFromAdmin);

module.exports = router;
