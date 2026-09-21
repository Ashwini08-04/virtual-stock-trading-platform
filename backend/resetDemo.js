require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./src/models/User");
const Holding = require("./src/models/Holding");
const Transaction = require("./src/models/Transaction");

const resetDemo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Transaction.deleteMany({});
    await Holding.deleteMany({});
    await User.updateOne(
      { _id: "6aafe0d0cdb9d83b4ce55ce3" },
      { $set: { cashBalance: 100000 } }
    );

    console.log("Demo data reset successfully ✅");
    console.log("Transactions: Cleared");
    console.log("Holdings: Cleared");
    console.log("Virtual Balance: ₹100000");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Reset Failed:", error.message);
    process.exit(1);
  }
};

resetDemo();