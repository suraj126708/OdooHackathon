const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Report Model (for content moderation)
const reportSchema = new Schema({
  reporter: { type: Schema.Types.ObjectId, ref: "User", required: true },
  targetType: {
    type: String,
    enum: ["question", "answer", "comment", "user"],
    required: true,
  },
  targetId: { type: Schema.Types.ObjectId, required: true },
  reason: {
    type: String,
    enum: [
      "spam",
      "inappropriate",
      "offensive",
      "plagiarism",
      "harassment",
      "other",
    ],
    required: true,
  },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "reviewed", "resolved", "dismissed"],
    default: "pending",
  },
  reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
  reviewedAt: { type: Date },
  adminNotes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Indexes for better performance
reportSchema.index({ status: 1 });
reportSchema.index({ targetType: 1, targetId: 1 });

// Create Model
const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
