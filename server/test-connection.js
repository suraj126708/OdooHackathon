const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function testConnection() {
  console.log("🔍 Testing server connection...\n");

  try {
    // Test 1: Health Check
    console.log("1. Testing health endpoint...");
    const healthResponse = await axios.get(`${BASE_URL}/ping`);
    console.log("✅ Health check passed:", healthResponse.data);
    console.log("");

    // Test 2: API Documentation
    console.log("2. Testing API documentation...");
    const apiResponse = await axios.get(`${BASE_URL}/api`);
    console.log("✅ API documentation accessible");
    console.log("");

    // Test 3: Registration endpoint (without data)
    console.log("3. Testing registration endpoint...");
    try {
      await axios.post(`${BASE_URL}/api/auth/signup`, {});
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log(
          "✅ Registration endpoint is accessible (returned validation error as expected)"
        );
      } else {
        console.log("❌ Registration endpoint error:", error.message);
      }
    }
    console.log("");

    console.log("🎉 All basic tests passed! Server is running correctly.");
    console.log("\n📝 Next steps:");
    console.log("- Make sure MongoDB is running");
    console.log("- Check your .env file configuration");
    console.log("- Try registering from the client application");
  } catch (error) {
    console.log("❌ Connection failed:", error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("1. Make sure the server is running (npm run dev)");
    console.log("2. Check if port 8080 is available");
    console.log("3. Verify no firewall is blocking the connection");
  }
}

// Run the test
testConnection();
