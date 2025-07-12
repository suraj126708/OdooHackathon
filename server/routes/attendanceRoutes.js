const express = require("express");
const {
  markAttendance,
  getUserAttendance,
} = require("../controllers/attendanceController");
const TokenAuthMiddleware = require("../middlewares/TokenAuthenticationMiddleware");

const router = express.Router();

router.post("/mark", TokenAuthMiddleware, markAttendance);
router.get("/:userId", TokenAuthMiddleware, getUserAttendance);

module.exports = router;
