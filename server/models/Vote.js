const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Vote Model
const voteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  targetType: { type: String, enum: ["question", "answer"], required: true },
  targetId: { type: Schema.Types.ObjectId, required: true },
  voteType: { type: String, enum: ["upvote", "downvote"], required: true },
  createdAt: { type: Date, default: Date.now },
});

// Indexes for better performance
voteSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });
voteSchema.index({ targetType: 1, targetId: 1 });

// Create Model
const Vote = mongoose.model("Vote", voteSchema);

module.exports = Vote;
