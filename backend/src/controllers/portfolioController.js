const Holding = require("../models/Holding");
const MarketData = require("../models/MarketData");

const getPortfolio = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const holdings = await Holding.find({ userId }).lean();

    const portfolio = await Promise.all(
      holdings.map(async (holding) => {
        const latestPrice = await MarketData.findOne({
          symbol: holding.symbol
        })
          .sort({ date: -1, time: -1 })
          .lean();

        const currentPrice = latestPrice ? latestPrice.close : 0;
        const investedValue = holding.quantity * holding.averageBuyPrice;
        const currentValue = holding.quantity * currentPrice;
        const profitLoss = currentValue - investedValue;

        return {
          symbol: holding.symbol,
          quantity: holding.quantity,
          averageBuyPrice: Number(holding.averageBuyPrice.toFixed(2)),
          currentPrice: Number(currentPrice.toFixed(2)),
          investedValue: Number(investedValue.toFixed(2)),
          currentValue: Number(currentValue.toFixed(2)),
          profitLoss: Number(profitLoss.toFixed(2)),
          profitLossPercent: investedValue
            ? Number(((profitLoss / investedValue) * 100).toFixed(2))
            : 0
        };
      })
    );

    const totalInvested = portfolio.reduce(
      (sum, stock) => sum + stock.investedValue,
      0
    );

    const totalCurrentValue = portfolio.reduce(
      (sum, stock) => sum + stock.currentValue,
      0
    );

    const totalProfitLoss = totalCurrentValue - totalInvested;

    res.json({
      holdings: portfolio,
      summary: {
        totalInvested: Number(totalInvested.toFixed(2)),
        totalCurrentValue: Number(totalCurrentValue.toFixed(2)),
        totalProfitLoss: Number(totalProfitLoss.toFixed(2)),
        totalProfitLossPercent: totalInvested
          ? Number(((totalProfitLoss / totalInvested) * 100).toFixed(2))
          : 0
      }
    });
  } catch (error) {
    console.error("Portfolio Error:", error.message);
    res.status(500).json({ message: "Failed to fetch portfolio" });
  }
};

module.exports = { getPortfolio };