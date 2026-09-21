const User = require("../models/User");
const Holding = require("../models/Holding");
const Transaction = require("../models/Transaction");

const tradeStock = async (req, res) => {
  try {
    const { userId, symbol, type, quantity, price, date, time } = req.body;

    if (!userId || !symbol || !type || !quantity || !price || !date || !time) {
      return res.status(400).json({ message: "All trade details are required" });
    }

    if (!["BUY", "SELL"].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type" });
    }

    if (quantity <= 0 || price <= 0) {
      return res.status(400).json({ message: "Quantity and price must be positive" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalAmount = Number((quantity * price).toFixed(2));

    if (type === "BUY") {
      if (user.cashBalance < totalAmount) {
        return res.status(400).json({
          message: "Insufficient virtual balance"
        });
      }

      let holding = await Holding.findOne({ userId, symbol });

      if (holding) {
        const totalQuantity = holding.quantity + quantity;
        const totalCost =
          holding.quantity * holding.averageBuyPrice + totalAmount;

        holding.quantity = totalQuantity;
        holding.averageBuyPrice = totalCost / totalQuantity;

        await holding.save();
      } else {
        await Holding.create({
          userId,
          symbol,
          quantity,
          averageBuyPrice: price
        });
      }

      user.cashBalance -= totalAmount;
      await user.save();
    }

    if (type === "SELL") {
      const holding = await Holding.findOne({ userId, symbol });

      if (!holding || holding.quantity < quantity) {
        return res.status(400).json({
          message: "Insufficient stock quantity"
        });
      }

      holding.quantity -= quantity;

      if (holding.quantity === 0) {
        await Holding.deleteOne({ _id: holding._id });
      } else {
        await holding.save();
      }

      user.cashBalance += totalAmount;
      await user.save();
    }

    const transaction = await Transaction.create({
      userId,
      symbol: symbol.toUpperCase(),
      type,
      quantity,
      price,
      totalAmount,
      date,
      time
    });

    res.status(201).json({
      message: `${type} order executed successfully`,
      transaction,
      cashBalance: user.cashBalance
    });
  } catch (error) {
    console.error("Trade Error:", error.message);
    res.status(500).json({ message: "Trade execution failed" });
  }
};

module.exports = { tradeStock };