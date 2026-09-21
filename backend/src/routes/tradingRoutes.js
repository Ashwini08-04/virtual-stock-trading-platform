const express = require("express");
const { tradeStock } = require("../controllers/tradingController");

const router = express.Router();

router.post("/trade", tradeStock);

module.exports = router;