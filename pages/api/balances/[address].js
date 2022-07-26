const mongoose = require("mongoose");
const Balance = require("../db/balance.js");

export default async function handler(req, res) {
  const { address, lastN } = req.query;
  const limit = lastN ? Number(lastN) : 10;
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
        eth: "$tokens.ETH",
        lpt: "$tokens.lLPT",
        leth: "$tokens.lETH",
      },
    },
    {
      $group: {
        _id: "$yearMonthDay",
        avgEth: {
          $avg: { $divide: [{ $toDouble: "$eth" }, 1000000000] },
        },
        avgLpt: {
          $avg: { $divide: [{ $toDouble: "$lpt" }, 1000000000] },
        },
        avglEth: {
          $avg: { $divide: [{ $toDouble: "$leth" }, 1000000000] },
        },
      },
    },
    {
      $sort: { _id: -1 },
    },
    {
      $project: {
        date: "$_id",
        avgEth: "$avgEth",
        avgLpt: "$avgLpt",
        avglEth: "$avglEth",
      },
    },
    {
      $limit: limit,
    },
  ]);
  res.send(result);
}
