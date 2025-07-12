const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Answer Model
const answerSchema = new Schema({
  content: { type: String, required: true },
  question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  totalVotes: { type: Number, default: 0 },
  isAccepted: { type: Boolean, default: false },
  acceptedAt: { type: Date },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  deletedAt: { type: Date },
  editHistory: [
    {
      editedBy: { type: Schema.Types.ObjectId, ref: "User" },
      editedAt: { type: Date, default: Date.now },
      previousContent: { type: String },
      reason: { type: String },
    },
  ],
  attachments: [
    {
      filename: { type: String },
      url: { type: String },
      size: { type: Number },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
});

// Indexes for better performance
answerSchema.index({ question: 1 });
answerSchema.index({ author: 1 });
answerSchema.index({ createdAt: -1 });
answerSchema.index({ totalVotes: -1 });
answerSchema.index({ isAccepted: -1 });

// Create Model
const Answer = mongoose.model("Answer", answerSchema);

module.exports = Answer;
