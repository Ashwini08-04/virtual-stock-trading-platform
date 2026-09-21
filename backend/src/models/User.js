const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    cashBalance: {
      type: Number,
      required: true,
      default: 100000
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);