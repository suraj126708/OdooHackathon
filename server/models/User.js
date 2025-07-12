const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attendanceSchema = new mongoose.Schema({
  presence: { type: String, required: true },
  problem: { type: String, required: true },
  additionalProblem: { type: String },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  date: { type: Date, required: true, default: Date.now },
});

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  workerID: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  attendance: [attendanceSchema],
  profilePicture: { type: String },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
