const express = require("express");
const { getPortfolio } = require("../controllers/portfolioController");

const router = express.Router();

// Get user portfolio
router.get("/", getPortfolio);

module.exports = router;