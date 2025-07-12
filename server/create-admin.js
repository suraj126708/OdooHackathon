const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcrypt");
require("dotenv").config();

const connectDB = require("./models/db");

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });

    if (existingAdmin) {
      console.log("Admin user already exists:");
      console.log(`Name: ${existingAdmin.name}`);
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Username: ${existingAdmin.username}`);
      console.log(`Role: ${existingAdmin.role}`);

      // Update role to admin if not already admin
      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        await existingAdmin.save();
        console.log("User role updated to admin!");
      }
      return;
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash("admin123", saltRounds);

    // Create admin user
    const adminUser = new User({
      name: "Admin User",
      email: "admin@gmail.com",
      username: "admin",
      password: hashedPassword,
      role: "admin",
      bio: "System Administrator",
      joinDate: new Date(),
      lastActive: new Date(),
    });

    await adminUser.save();

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@gmail.com");
    console.log("👤 Username: admin");
    console.log("🔑 Password: admin123");
    console.log("👑 Role: admin");
    console.log("\nYou can now login with these credentials!");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

createAdmin();
