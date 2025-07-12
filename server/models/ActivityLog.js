const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Activity Log Model (for admin monitoring)
const activityLogSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: {
    type: String,
    enum: [
      "login",
      "logout",
      "ask_question",
      "answer_question",
      "vote",
      "comment",
      "edit",
      "delete",
    ],
    required: true,
  },
  targetType: { type: String, enum: ["question", "answer", "comment", "user"] },
  targetId: { type: Schema.Types.ObjectId },
  details: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now },
});

// Indexes for better performance
activityLogSchema.index({ user: 1 });
activityLogSchema.index({ timestamp: -1 });

// Create Model
const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

module.exports = ActivityLog;
