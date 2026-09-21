const Transaction = require("../models/Transaction");

const getTransactions = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Get only this user's transactions
    const transactions = await Transaction.find({ userId })
      .sort({ date: -1, time: -1, createdAt: -1 })
      .lean();

    res.json({ transactions });
  } catch (error) {
    console.error("Transaction History Error:", error.message);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};

module.exports = { getTransactions };