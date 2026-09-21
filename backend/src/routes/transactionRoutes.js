const express = require("express");
const { getTransactions } = require("../controllers/transactionController");

const router = express.Router();

// Get transaction history
router.get("/", getTransactions);

module.exports = router;