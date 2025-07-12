const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

// Sign Up Controller
const signUp = async (req, res) => {
  try {
    const { name, email, password, contact, address, age, gender, workerID } =
      req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists, you can log in." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const profilePicture = req.file.path;

    const newUser = new userModel({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      contact,
      address,
      age,
      gender,
      workerID,
      profilePicture,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error creating user",
      success: false,
    });
  }
};

module.exports = { signUp };

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errMessage = "Invalid email or password!";

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(403).json({ message: errMessage, success: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({ message: errMessage, success: false });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      "suraj6708",
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      success: true,
      token: jwtToken,
      user: {
        email: user.email,
        name: user.name,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error during login",
      success: false,
    });
  }
};

module.exports = { signUp, login };
