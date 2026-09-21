const MarketData = require("../models/MarketData");

const getStocks = async (req, res) => {
  try {
    const stocks = await MarketData.aggregate([
      {
        $group: {
          _id: "$symbol",
          latestDate: { $max: "$date" }
        }
      },
      {
        $project: {
          _id: 0,
          symbol: "$_id",
          latestDate: 1
        }
      },
      { $sort: { symbol: 1 } }
    ]);

    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stocks" });
  }
};

const getStockHistory = async (req, res) => {
  try {
    const { symbol } = req.params;

    const data = await MarketData.find({ symbol: symbol.toUpperCase() })
      .sort({ date: 1, time: 1 })
      .lean();

    if (!data.length) {
      return res.status(404).json({ message: "Stock not found" });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stock history" });
  }
};

const getStockPrice = async (req, res) => {
  try {
    const { symbol } = req.params;
    const { date, time } = req.query;

    if (!date || !time) {
      return res.status(400).json({
        message: "Date and time are required"
      });
    }

    const data = await MarketData.findOne({
      symbol: symbol.toUpperCase(),
      date,
      time
    }).lean();

    if (!data) {
      return res.status(404).json({
        message: "No market data found for selected date and time"
      });
    }

    res.json({
      symbol: data.symbol,
      date: data.date,
      time: data.time,
      price: data.close
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch stock price" });
  }
};

module.exports = {
  getStocks,
  getStockHistory,
  getStockPrice
};