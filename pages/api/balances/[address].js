const mongoose = require("mongoose");
const Balance = require("../db/balance.js");

export default async function handler(req, res) {
  const { address, lastN } = req.query;
  const limit = lastN ? lastN : 10
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
        gwei: { $divide: [{ $toLong: "$balance" }, 1000000000] },
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
      $sort: { _id: -1 },
    },
    {
      $project: {
        date: "$_id",
        avgGwei: "$avgGwei",
      },
    },
    {
        $limit : limit,
    },
  ]);
  res.send(result);
}
