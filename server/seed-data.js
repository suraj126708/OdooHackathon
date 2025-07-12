const mongoose = require("mongoose");
const { User, Question, Tag, Answer } = require("./models");
require("dotenv").config();

async function seedData() {
  try {
    // Connect to MongoDB
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/odoo-hackathon";
    console.log("🔗 Connecting to MongoDB:", mongoUri);

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Question.deleteMany({});
    await Tag.deleteMany({});
    await Answer.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Get a user (create one if none exists)
    let user = await User.findOne();
    if (!user) {
      user = new User({
        name: "Demo User",
        email: "demo@example.com",
        username: "demouser",
        password:
          "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HS.iK2i", // password: demo123
        role: "user",
      });
      await user.save();
      console.log("👤 Created demo user");
    }

    // Create sample tags with createdBy field
    const tags = await Tag.insertMany([
      {
        name: "javascript",
        color: "#f7df1e",
        questionCount: 0,
        createdBy: user._id,
      },
      {
        name: "react",
        color: "#61dafb",
        questionCount: 0,
        createdBy: user._id,
      },
      {
        name: "nodejs",
        color: "#339933",
        questionCount: 0,
        createdBy: user._id,
      },
      {
        name: "mongodb",
        color: "#47a248",
        questionCount: 0,
        createdBy: user._id,
      },
      { name: "sql", color: "#336791", questionCount: 0, createdBy: user._id },
      {
        name: "python",
        color: "#3776ab",
        questionCount: 0,
        createdBy: user._id,
      },
      { name: "html", color: "#e34f26", questionCount: 0, createdBy: user._id },
      { name: "css", color: "#1572b6", questionCount: 0, createdBy: user._id },
      { name: "git", color: "#f05032", questionCount: 0, createdBy: user._id },
      {
        name: "docker",
        color: "#2496ed",
        questionCount: 0,
        createdBy: user._id,
      },
    ]);

    console.log("🏷️  Created sample tags");

    // Create sample questions
    const sampleQuestions = [
      {
        title:
          "How to join 2 columns in a data set to make a separate column in SQL",
        description:
          "I do not know the code for it as I am a beginner. As an example, I have A and B. I want to join them to create a new column C that would contain both A and B.",
        tags: [tags[4]._id], // SQL
        author: user._id,
        views: 125,
        upvotes: 5,
        downvotes: 0,
        totalVotes: 5,
        answerCount: 2,
      },
      {
        title: "Best practices for React component optimization",
        description:
          "I'm building a large React application and noticing performance issues. What are the best practices for optimizing React components?",
        tags: [tags[1]._id, tags[0]._id], // React, JavaScript
        author: user._id,
        views: 89,
        upvotes: 12,
        downvotes: 0,
        totalVotes: 12,
        answerCount: 1,
      },
      {
        title: "How to implement authentication in Node.js with JWT",
        description:
          "I need to implement user authentication in my Node.js application using JSON Web Tokens. What's the best approach?",
        tags: [tags[2]._id, tags[0]._id], // Node.js, JavaScript
        author: user._id,
        views: 156,
        upvotes: 8,
        downvotes: 1,
        totalVotes: 7,
        answerCount: 0,
      },
      {
        title: "MongoDB aggregation pipeline examples",
        description:
          "Can someone provide some practical examples of MongoDB aggregation pipelines for data analysis?",
        tags: [tags[3]._id], // MongoDB
        author: user._id,
        views: 78,
        upvotes: 6,
        downvotes: 0,
        totalVotes: 6,
        answerCount: 1,
      },
      {
        title: "CSS Grid vs Flexbox - when to use which?",
        description:
          "I'm confused about when to use CSS Grid and when to use Flexbox. Can someone explain the differences and use cases?",
        tags: [tags[7]._id], // CSS
        author: user._id,
        views: 203,
        upvotes: 15,
        downvotes: 2,
        totalVotes: 13,
        answerCount: 3,
      },
    ];

    const questions = await Question.insertMany(sampleQuestions);
    console.log("❓ Created sample questions");

    // Create sample answers
    const sampleAnswers = [
      {
        content:
          "You can use the CONCAT function in SQL to join two columns together. Here's the syntax: SELECT CONCAT(column1, column2) AS new_column FROM table_name;",
        question: questions[0]._id,
        author: user._id,
        upvotes: 8,
        downvotes: 0,
        totalVotes: 8,
        isAccepted: true,
      },
      {
        content:
          "Another approach is to use the || operator (in some SQL dialects) or the + operator (in SQL Server). For example: SELECT column1 || column2 AS new_column FROM table_name;",
        question: questions[0]._id,
        author: user._id,
        upvotes: 3,
        downvotes: 0,
        totalVotes: 3,
        isAccepted: false,
      },
      {
        content:
          "Use React.memo for functional components, useMemo for expensive calculations, and useCallback for function references to prevent unnecessary re-renders.",
        question: questions[1]._id,
        author: user._id,
        upvotes: 15,
        downvotes: 0,
        totalVotes: 15,
        isAccepted: true,
      },
      {
        content:
          "MongoDB aggregation pipelines are powerful for data transformation. Here's a simple example: db.collection.aggregate([{ $match: { status: 'active' } }, { $group: { _id: '$category', count: { $sum: 1 } } }])",
        question: questions[3]._id,
        author: user._id,
        upvotes: 7,
        downvotes: 0,
        totalVotes: 7,
        isAccepted: true,
      },
    ];

    await Answer.insertMany(sampleAnswers);
    console.log("💬 Created sample answers");

    // Update question answer counts
    for (const question of questions) {
      const answerCount = await Answer.countDocuments({
        question: question._id,
      });
      await Question.findByIdAndUpdate(question._id, { answerCount });
    }

    // Update tag question counts
    for (const tag of tags) {
      const questionCount = await Question.countDocuments({ tags: tag._id });
      await Tag.findByIdAndUpdate(tag._id, { questionCount });
    }

    console.log("✅ Sample data seeded successfully!");
    console.log("\n📊 Created:");
    console.log(`- ${tags.length} tags`);
    console.log(`- ${questions.length} questions`);
    console.log(`- ${sampleAnswers.length} answers`);
    console.log("\n🚀 You can now test the homepage with real data!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    if (error.name === "ValidationError") {
      console.error("Validation errors:", error.errors);
    }
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log("🔌 Disconnected from MongoDB");
    }
  }
}

// Run the seed function
seedData();
