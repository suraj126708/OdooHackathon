const express = require("express");
const router = express.Router();

const Contact = require("../models/Contact");

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  // Check if required fields are provided
  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Create a new contact without checking for duplicate emails
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    res
      .status(200)
      .json({ message: "Your message has been sent successfully!" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while saving the message" });
  }
});

module.exports = router;
