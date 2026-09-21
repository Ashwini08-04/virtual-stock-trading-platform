const mongoose = require("mongoose");

const marketDataSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      index: true
    },
    date: {
      type: String,
      required: true,
      index: true
    },
    time: {
      type: String,
      required: true
    },
    open: {
      type: Number,
      required: true
    },
    high: {
      type: Number,
      required: true
    },
    low: {
      type: Number,
      required: true
    },
    close: {
      type: Number,
      required: true
    },
    volume: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

marketDataSchema.index({ symbol: 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model("MarketData", marketDataSchema);