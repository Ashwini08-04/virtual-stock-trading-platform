const fs = require("fs");
const path = require("path");

const stocks = {
  RELIANCE: 1450,
  TCS: 3200,
  INFY: 1550,
  HDFCBANK: 1750,
  ICICIBANK: 1350,
  SBIN: 850,
  ITC: 500,
  LT: 3600,
  BHARTIARTL: 1850,
  WIPRO: 520
};

const rows = ["symbol,date,time,open,high,low,close,volume"];

const startDate = new Date("2026-09-01T00:00:00");

function isWeekday(date) {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatTime(hour, minute) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

let tradingDays = 0;
let currentDate = new Date(startDate);

while (tradingDays < 15) {
  if (!isWeekday(currentDate)) {
    currentDate.setDate(currentDate.getDate() + 1);
    continue;
  }

  const date = formatDate(currentDate);

  for (const [symbol, basePrice] of Object.entries(stocks)) {
    let previousClose = basePrice;

    for (let hour = 9; hour <= 15; hour++) {
      for (let minute of [15, 45]) {
        if (hour === 15 && minute === 45) continue;

        const open = previousClose;
        const change = (Math.random() - 0.5) * 0.02;
        const close = open * (1 + change);

        const high = Math.max(open, close) * (1 + Math.random() * 0.005);
        const low = Math.min(open, close) * (1 - Math.random() * 0.005);

        const volume = Math.floor(50000 + Math.random() * 450000);

        rows.push(
          `${symbol},${date},${formatTime(hour, minute)},${open.toFixed(2)},${high.toFixed(2)},${low.toFixed(2)},${close.toFixed(2)},${volume}`
        );

        previousClose = close;
      }
    }
  }

  tradingDays++;
  currentDate.setDate(currentDate.getDate() + 1);
}

const filePath = path.join(__dirname, "data", "market_data.csv");

fs.writeFileSync(filePath, rows.join("\n"));

console.log(`Market data generated successfully!`);
console.log(`Trading days: ${tradingDays}`);
console.log(`Stocks: ${Object.keys(stocks).length}`);
console.log(`CSV file: ${filePath}`);
console.log(`Total rows: ${rows.length - 1}`);