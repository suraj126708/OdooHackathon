const User = require("../models/User");

exports.markAttendance = async (req, res) => {
  try {
    console.log(req.body);
    const { presence, problem, additionalProblem, location } = req.body;

    // Validate location
    if (
      !location ||
      typeof location.lat === "undefined" ||
      typeof location.lng === "undefined"
    ) {
      return res
        .status(400)
        .json({ error: "Invalid or missing location data" });
    }

    // Get today's date
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    // Check if attendance is already recorded for today
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const alreadyRecorded = user.attendance.some((record) => {
      const recordDate = new Date(record.date);
      return recordDate >= startOfDay && recordDate < endOfDay; // Check if the record is today
    });

    if (alreadyRecorded) {
      return res
        .status(400)
        .json({ error: "Attendance already marked for today." });
    }

    // Create attendance record
    const attendanceRecord = {
      presence,
      problem,
      additionalProblem,
      location: {
        lat: location.lat,
        lng: location.lng,
      },
      date: new Date(),
    };

    // Update user attendance
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $push: { attendance: attendanceRecord } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(201)
      .json({ message: "Attendance recorded successfully", data: updatedUser });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ error: "Error recording attendance" });
  }
};

exports.getUserAttendance = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ attendance: user.attendance });
  } catch (error) {
    console.error("Error retrieving attendance:", error);
    res.status(500).json({ error: "Error retrieving attendance" });
  }
};
