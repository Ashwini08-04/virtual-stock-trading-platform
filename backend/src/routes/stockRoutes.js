const express = require("express");
const {
  getStocks,
  getStockHistory,
  getStockPrice
} = require("../controllers/stockController");

const router = express.Router();

router.get("/:symbol/price", getStockPrice);
router.get("/:symbol", getStockHistory);
router.get("/", getStocks);

module.exports = router;