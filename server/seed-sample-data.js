const mongoose = require("mongoose");
const User = require("./models/User");
const Question = require("./models/Question");
const Answer = require("./models/Answer");
const Tag = require("./models/Tag");
const bcrypt = require("bcrypt");
require("dotenv").config();

const connectDB = require("./models/db");

const seedSampleData = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to MongoDB");

    // Create sample tags
    const tags = await Tag.create([
      { name: "JavaScript", description: "JavaScript programming" },
      { name: "React", description: "React framework" },
      { name: "Node.js", description: "Node.js backend" },
      { name: "MongoDB", description: "MongoDB database" },
      { name: "General", description: "General questions" },
    ]);

    console.log("Created tags:", tags.length);

    // Create sample users
    const hashedPassword = await bcrypt.hash("password123", 12);

    const users = await User.create([
      {
        name: "John Doe",
        email: "john@example.com",
        username: "johndoe",
        password: hashedPassword,
        role: "user",
        bio: "Software developer",
        joinDate: new Date(),
        lastActive: new Date(),
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        username: "janesmith",
        password: hashedPassword,
        role: "user",
        bio: "Full-stack developer",
        joinDate: new Date(),
        lastActive: new Date(),
      },
      {
        name: "Bob Wilson",
        email: "bob@example.com",
        username: "bobwilson",
        password: hashedPassword,
        role: "user",
        bio: "Frontend developer",
        joinDate: new Date(),
        lastActive: new Date(),
      },
    ]);

    console.log("Created users:", users.length);

    // Create sample questions
    const questions = await Question.create([
      {
        title: "How to use React hooks?",
        description:
          "I'm new to React and want to learn about hooks. Can someone explain useState and useEffect?",
        author: users[0]._id,
        tags: [tags[1]._id], // React
        views: 15,
        totalVotes: 3,
        answerCount: 2,
      },
      {
        title: "MongoDB connection issues",
        description:
          "I'm having trouble connecting to MongoDB. Getting connection timeout errors.",
        author: users[1]._id,
        tags: [tags[3]._id], // MongoDB
        views: 8,
        totalVotes: 1,
        answerCount: 1,
      },
      {
        title: "JavaScript async/await best practices",
        description:
          "What are the best practices for using async/await in JavaScript?",
        author: users[2]._id,
        tags: [tags[0]._id], // JavaScript
        views: 25,
        totalVotes: 5,
        answerCount: 3,
      },
      {
        title: "Node.js performance optimization",
        description:
          "How can I optimize the performance of my Node.js application?",
        author: users[0]._id,
        tags: [tags[2]._id], // Node.js
        views: 12,
        totalVotes: 2,
        answerCount: 1,
      },
    ]);

    console.log("Created questions:", questions.length);

    // Create sample answers
    const answers = await Answer.create([
      {
        question: questions[0]._id,
        author: users[1]._id,
        content:
          "React hooks are functions that let you use state and other React features in functional components. useState lets you add state, and useEffect lets you perform side effects.",
        totalVotes: 4,
        isAccepted: true,
      },
      {
        question: questions[0]._id,
        author: users[2]._id,
        content:
          "Here's a simple example: const [count, setCount] = useState(0); This creates a state variable 'count' and a function 'setCount' to update it.",
        totalVotes: 2,
        isAccepted: false,
      },
      {
        question: questions[1]._id,
        author: users[0]._id,
        content:
          "Check your connection string and make sure MongoDB is running. Also verify your network settings and firewall.",
        totalVotes: 3,
        isAccepted: true,
      },
      {
        question: questions[2]._id,
        author: users[1]._id,
        content:
          "Always use try-catch blocks with async/await, avoid mixing with .then(), and handle errors properly.",
        totalVotes: 6,
        isAccepted: true,
      },
      {
        question: questions[2]._id,
        author: users[0]._id,
        content:
          "Use Promise.all() for parallel operations and consider using worker threads for CPU-intensive tasks.",
        totalVotes: 4,
        isAccepted: false,
      },
      {
        question: questions[2]._id,
        author: users[2]._id,
        content:
          "Don't forget to use proper error boundaries and avoid creating async functions inside loops.",
        totalVotes: 3,
        isAccepted: false,
      },
      {
        question: questions[3]._id,
        author: users[1]._id,
        content:
          "Use clustering, implement caching, optimize database queries, and consider using PM2 for process management.",
        totalVotes: 3,
        isAccepted: true,
      },
    ]);

    console.log("Created answers:", answers.length);

    // Update question answer counts
    for (const question of questions) {
      const answerCount = await Answer.countDocuments({
        question: question._id,
      });
      await Question.findByIdAndUpdate(question._id, { answerCount });
    }

    // Update user statistics
    for (const user of users) {
      const questionsAsked = await Question.countDocuments({
        author: user._id,
      });
      const answersGiven = await Answer.countDocuments({ author: user._id });
      const acceptedAnswers = await Answer.countDocuments({
        author: user._id,
        isAccepted: true,
      });

      await User.findByIdAndUpdate(user._id, {
        questionsAsked,
        answersGiven,
        acceptedAnswers,
      });
    }

    console.log("✅ Sample data created successfully!");
    console.log(
      `📊 Created ${users.length} users, ${questions.length} questions, and ${answers.length} answers`
    );
    console.log("🎯 You can now test the admin dashboard with real data!");
  } catch (error) {
    console.error("❌ Error creating sample data:", error);
  } finally {
    mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

seedSampleData();
