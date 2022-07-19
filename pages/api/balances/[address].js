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

export default async function handler(req, res) {
  const result = await Balance.aggregate([
    {
      $project: {
        yearMonthDay: {
          $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
        },
        gwei: { $divide: [{ $toLong: "$balance" }, 1000000] },
      },
    },
    {
      $group: {
        _id: "$yearMonthDay",
        avgGwei: {
          $avg: "$gwei",
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
    {
      $project: {
        date: "$_id",
        avgGwei: "$avgGwei",
      }
    }
  ]);
  const { address } = req.query;
  res.send(result);
}
