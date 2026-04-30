const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const connectDB = require("./config/db");

dotenv.config();

const seedUser = async () => {
  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash("Vicky2828@", 10);
    const user = await User.create({
      username: "vicky",
      email: "mrtnvicky2020@gmail.com",
      name: "Vignesh M",
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
