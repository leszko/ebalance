const mongoose = require("mongoose");

mongoose.connect(
  process.env.MONGO_URL
    ? process.env.MONGO_URL
    : "mongodb://localhost:27017/test"
);

const balanceSchema = new mongoose.Schema({
  address: String,
  timestamp: Date,
  tokens: {
    type: Map,
    of: String
  }
}, {timestamps: true
});

const balance = mongoose.model("Balance", balanceSchema);

module.exports = balance;
