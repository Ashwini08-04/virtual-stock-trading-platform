const User = require("../models/User");

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("name cashBalance");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      name: user.name,
      cashBalance: Number(user.cashBalance.toFixed(2)),
    });
  } catch (error) {
    console.error("User Error:", error.message);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

module.exports = { getUser };