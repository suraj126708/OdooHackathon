const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const {
  convertToImageUrl,
  convertToImageUrlStatic,
} = require("../utils/imageUtils");

// Helper function to process user data for response
const processUserForResponse = (user, req) => {
  const userObj = user.toObject ? user.toObject() : user;
  return {
    ...userObj,
    profilePicture: userObj.profilePicture
      ? req
        ? convertToImageUrl(userObj.profilePicture, req)
        : convertToImageUrlStatic(userObj.profilePicture)
      : null,
  };
};

// Sign Up Controller
const signUp = async (req, res) => {
  try {
    const { name, email, password, username, bio } = req.body;

    // Validate required fields
    if (!name || !email || !password || !username) {
      return res.status(400).json({
        message: "All required fields must be provided",
        success: false,
        required: ["name", "email", "password", "username"],
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const conflictField = existingUser.email === email ? "email" : "username";
      return res.status(409).json({
        message: `User already exists with this ${conflictField}`,
        success: false,
        field: conflictField,
      });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
        success: false,
      });
    }

    // Handle profile picture if provided
    const profilePicture = req.file
      ? convertToImageUrl(req.file.path, req)
      : null;

    // Create new user
    const newUser = new User({
      name,
      email,
      username,
      password: await bcrypt.hash(password, 12), // Increased salt rounds for security
      profilePicture,
      bio: bio || "",
      role: "user", // Default role
      joinDate: new Date(),
      lastActive: new Date(),
    });

    await newUser.save();

    // Generate JWT token for immediate login
    const jwtToken = jwt.sign(
      {
        email: newUser.email,
        _id: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Return success response with user data (excluding password)
    const userResponse = processUserForResponse(newUser, req);
    res.status(201).json({
      message: "User registered successfully",
      success: true,
      token: jwtToken,
      user: {
        _id: userResponse._id,
        name: userResponse.name,
        email: userResponse.email,
        username: userResponse.username,
        profilePicture: userResponse.profilePicture,
        bio: userResponse.bio,
        role: userResponse.role,
        joinDate: userResponse.joinDate,
        reputation: userResponse.reputation,
      },
    });
  } catch (err) {
    console.error("SignUp Error:", err);

    // Handle specific MongoDB errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(409).json({
        message: `This ${field} is already taken`,
        success: false,
        field: field,
      });
    }

    res.status(500).json({
      message: "Internal server error during registration",
      success: false,
    });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false,
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        message: "Account is deactivated. Please contact support.",
        success: false,
      });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({
        message: `Account is banned. Reason: ${
          user.banReason || "No reason provided"
        }`,
        success: false,
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    // Update last active time
    user.lastActive = new Date();
    await user.save();

    // Generate JWT token
    const jwtToken = jwt.sign(
      {
        email: user.email,
        _id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Return success response
    const userResponse = processUserForResponse(user, req);
    res.status(200).json({
      message: "Login successful",
      success: true,
      token: jwtToken,
      user: {
        _id: userResponse._id,
        name: userResponse.name,
        email: userResponse.email,
        username: userResponse.username,
        profilePicture: userResponse.profilePicture,
        bio: userResponse.bio,
        role: userResponse.role,
        reputation: userResponse.reputation,
        joinDate: userResponse.joinDate,
        lastActive: userResponse.lastActive,
        questionsAsked: userResponse.questionsAsked,
        answersGiven: userResponse.answersGiven,
        acceptedAnswers: userResponse.acceptedAnswers,
        totalVotesReceived: userResponse.totalVotesReceived,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({
      message: "Internal server error during login",
      success: false,
    });
  }
};

// Get Current User Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const userResponse = processUserForResponse(user, req);
    res.status(200).json({
      message: "Profile retrieved successfully",
      success: true,
      user: {
        _id: userResponse._id,
        name: userResponse.name,
        email: userResponse.email,
        username: userResponse.username,
        profilePicture: userResponse.profilePicture,
        bio: userResponse.bio,
        role: userResponse.role,
        reputation: userResponse.reputation,
        joinDate: userResponse.joinDate,
        lastActive: userResponse.lastActive,
        questionsAsked: userResponse.questionsAsked,
        answersGiven: userResponse.answersGiven,
        acceptedAnswers: userResponse.acceptedAnswers,
        totalVotesReceived: userResponse.totalVotesReceived,
      },
    });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (req.file) user.profilePicture = convertToImageUrl(req.file.path, req);

    await user.save();

    const userResponse = processUserForResponse(user, req);
    res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: {
        _id: userResponse._id,
        name: userResponse.name,
        email: userResponse.email,
        username: userResponse.username,
        profilePicture: userResponse.profilePicture,
        bio: userResponse.bio,
        role: userResponse.role,
        reputation: userResponse.reputation,
      },
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Logout (client-side token removal, but we can log it)
const logout = async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Promote user to admin (only existing admins can do this)
const promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;

    // Check if current user is admin
    if (currentUser.role !== "admin") {
      return res.status(403).json({
        message: "Only admins can promote users to admin role",
        success: false,
      });
    }

    // Find the user to promote
    const userToPromote = await User.findById(userId);
    if (!userToPromote) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if user is already admin
    if (userToPromote.role === "admin") {
      return res.status(400).json({
        message: "User is already an admin",
        success: false,
      });
    }

    // Promote user to admin
    userToPromote.role = "admin";
    await userToPromote.save();

    res.status(200).json({
      message: "User promoted to admin successfully",
      success: true,
      user: {
        _id: userToPromote._id,
        name: userToPromote.name,
        email: userToPromote.email,
        username: userToPromote.username,
        role: userToPromote.role,
      },
    });
  } catch (err) {
    console.error("Promote to Admin Error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Demote admin to user (only existing admins can do this)
const demoteFromAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;

    // Check if current user is admin
    if (currentUser.role !== "admin") {
      return res.status(403).json({
        message: "Only admins can demote other admins",
        success: false,
      });
    }

    // Prevent self-demotion
    if (currentUser._id.toString() === userId) {
      return res.status(400).json({
        message: "You cannot demote yourself from admin role",
        success: false,
      });
    }

    // Find the user to demote
    const userToDemote = await User.findById(userId);
    if (!userToDemote) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if user is admin
    if (userToDemote.role !== "admin") {
      return res.status(400).json({
        message: "User is not an admin",
        success: false,
      });
    }

    // Demote user to regular user
    userToDemote.role = "user";
    await userToDemote.save();

    res.status(200).json({
      message: "Admin demoted to user successfully",
      success: true,
      user: {
        _id: userToDemote._id,
        name: userToDemote.name,
        email: userToDemote.email,
        username: userToDemote.username,
        role: userToDemote.role,
      },
    });
  } catch (err) {
    console.error("Demote from Admin Error:", err);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports = {
  signUp,
  login,
  getProfile,
  updateProfile,
  logout,
  promoteToAdmin,
  demoteFromAdmin,
};
