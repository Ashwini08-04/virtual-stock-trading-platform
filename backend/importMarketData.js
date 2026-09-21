require("dotenv").config();

const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("mongoose");

const MarketData = require("./src/models/MarketData");

const filePath = path.join(__dirname, "data", "market_data.csv");

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");

    const records = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        records.push({
          symbol: row.symbol,
          date: row.date,
          time: row.time,
          open: Number(row.open),
          high: Number(row.high),
          low: Number(row.low),
          close: Number(row.close),
          volume: Number(row.volume)
        });
      })
      .on("end", async () => {
        await MarketData.deleteMany();
        await MarketData.insertMany(records);

        console.log(`${records.length} market records imported successfully ✅`);

        await mongoose.connection.close();
        console.log("MongoDB Connection Closed.");
      })
      .on("error", (error) => {
        console.error("CSV Read Error:", error.message);
      });
  } catch (error) {
    console.error("Import Failed:", error.message);
    process.exit(1);
  }
};

importData();