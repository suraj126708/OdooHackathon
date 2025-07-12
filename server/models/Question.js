const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Question Model
const questionSchema = new Schema({
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag", required: true }],
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  totalVotes: { type: Number, default: 0 },
  answerCount: { type: Number, default: 0 },
  acceptedAnswer: { type: Schema.Types.ObjectId, ref: "Answer" },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  deletedBy: { type: Schema.Types.ObjectId, ref: "User" },
  deletedAt: { type: Date },
  editHistory: [
    {
      editedBy: { type: Schema.Types.ObjectId, ref: "User" },
      editedAt: { type: Date, default: Date.now },
      previousTitle: { type: String },
      previousDescription: { type: String },
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
questionSchema.index({ author: 1 });
questionSchema.index({ tags: 1 });
questionSchema.index({ createdAt: -1 });
questionSchema.index({ totalVotes: -1 });
questionSchema.index({ views: -1 });
questionSchema.index({ isActive: 1, isDeleted: 1 });

// Create Model
const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
