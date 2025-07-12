// Import all models
const User = require("./User");
const Tag = require("./Tag");
const Question = require("./Question");
const Answer = require("./Answer");

const Vote = require("./Vote");
const Notification = require("./Notification");
const Report = require("./Report");
const ActivityLog = require("./ActivityLog");
const PlatformMessage = require("./PlatformMessage");

// Export all models
module.exports = {
  User,
  Tag,
  Question,
  Answer,

  Vote,
  Notification,
  Report,
  ActivityLog,
  PlatformMessage,
};
