require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./src/models/User");

const seedUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany();

    await User.create({
      name: "Ashwini",
      cashBalance: 100000
    });

    console.log("Predefined user created successfully ✅");
    console.log("Virtual Balance: ₹100000");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Seed Failed:", error.message);
    process.exit(1);
  }
};

seedUser();