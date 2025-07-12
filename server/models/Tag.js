const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Tag Model
const tagSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  color: { type: String, default: "#007bff" },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  questionCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

// Indexes for better performance
tagSchema.index({ name: 1 });
tagSchema.index({ questionCount: -1 });

// Create Model
const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
