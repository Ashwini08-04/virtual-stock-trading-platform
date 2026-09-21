require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");

const stockRoutes = require("./src/routes/stockRoutes");
const tradingRoutes = require("./src/routes/tradingRoutes");
const portfolioRoutes = require("./src/routes/portfolioRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
const userRoutes = require("./src/routes/userRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Health check API
app.get("/api/health", (req, res) => {
  res.json({ message: "Virtual Stock Trading API is running 🚀" });
});

// Stock market APIs
app.use("/api/stocks", stockRoutes);

// Trading APIs
app.use("/api/trading", tradingRoutes);

// Portfolio APIs
app.use("/api/portfolio", portfolioRoutes);

// Transaction history APIs
app.use("/api/transactions", transactionRoutes);

app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

