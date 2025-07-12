const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User Model
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  profilePicture: { type: String },
  role: {
    type: String,
    enum: ["guest", "user", "admin"],
    default: "user",
  },
  bio: { type: String },
  reputation: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isBanned: { type: Boolean, default: false },
  banReason: { type: String },
  joinDate: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  questionsAsked: { type: Number, default: 0 },
  answersGiven: { type: Number, default: 0 },
  acceptedAnswers: { type: Number, default: 0 },
  totalVotesReceived: { type: Number, default: 0 },
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

// Create Model
const User = mongoose.model("User", userSchema);

module.exports = User;
