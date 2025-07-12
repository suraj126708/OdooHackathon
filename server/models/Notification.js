const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Notification Model
const notificationSchema = new Schema({
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  type: {
    type: String,
    enum: ["answer", "vote", "accepted_answer", "system"],
    required: true,
  },
  message: { type: String, required: true },
  relatedQuestion: { type: Schema.Types.ObjectId, ref: "Question" },
  relatedAnswer: { type: Schema.Types.ObjectId, ref: "Answer" },

  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  readAt: { type: Date },
});

// Indexes for better performance
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

// Create Model
const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
