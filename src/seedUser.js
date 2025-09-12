const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const connectDB = require("./config/db");

dotenv.config();

const seedUser = async () => {
  try {
    connectDB();

    const hashedPassword = await bcrypt.hash("admin", 10);
    const user = await User.create({
      username: "admin",
      email: "admin@gmail.com",
      name : "Admin",
      password: hashedPassword,
    });

    console.log("✅ User seeded:", user);
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding user:", error.message);
    process.exit(1);
  }
};

seedUser();
