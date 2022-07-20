const mongoose = require("mongoose");
const Balance = require("../db/balance.js");

export default async function handler(req, res) {
  const { address } = req.query;
  const result = await Balance.aggregate([
    {
      $match: {
        address: `${address}`,
      },
    },
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
      },
    },
  ]);
  res.send(result);
}
