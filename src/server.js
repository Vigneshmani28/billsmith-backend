require("dotenv").config();
const app = require("./app");

// For local development
if (process.env.NODE_ENV === "development") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export app for Vercel serverless functions
module.exports = app;
