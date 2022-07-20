const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGO_URL
    ? process.env.MONGO_URL
    : "mongodb://localhost:27017/test"
);
const Balance = mongoose.model("Balance", {
  token: String,
  address: String,
  balance: String,
  timestamp: Date,
});

module.exports = Balance;