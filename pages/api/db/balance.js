const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGO_URL
    ? process.env.MONGO_URL
    : "mongodb://localhost:27017/test"
);
const Balance = mongoose.model("Balance", {
  address: String,
  timestamp: Date,
  tokens: {
    type: Map,
    of: String
  }
});

module.exports = Balance;
