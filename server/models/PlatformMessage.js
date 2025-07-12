const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Platform Message Model (for admin announcements)
const platformMessageSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ["announcement", "maintenance", "feature_update", "warning"],
    required: true,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  targetUsers: [{ type: Schema.Types.ObjectId, ref: "User" }], // Empty array means all users
  readBy: [
    {
      user: { type: Schema.Types.ObjectId, ref: "User" },
      readAt: { type: Date, default: Date.now },
    },
  ],
});

// Create Model
const PlatformMessage = mongoose.model(
  "PlatformMessage",
  platformMessageSchema
);

module.exports = PlatformMessage;
