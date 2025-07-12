const express = require("express");
const TokenAuthMiddleware = require("../middlewares/TokenAuthenticationMiddleware");
const User = require("../models/User");

const router = express.Router();

router.get("/", TokenAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: { user },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
