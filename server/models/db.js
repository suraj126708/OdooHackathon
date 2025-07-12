const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/odoo-hackathon";
    console.log("🔗 Connecting to MongoDB:", mongoUri);

    console.log("🔗 MONGODB_URI:", process.env.MONGODB_URI || "not found");

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error("💡 Make sure MongoDB is running on your system");
    console.error("💡 Or set MONGODB_URI environment variable");
    process.exit(1);
  }
};

module.exports = connectDB;
