const ethers = require("ethers");
const Balance = require('../db/balance.js')

// Configure connection to ETH RPC
const provider = new ethers.providers.JsonRpcProvider(
  "https://arb1.arbitrum.io/rpc"
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }
  if (!req.body) {
    res.status(400).send({ message: "Invalid parameters" });
    return;
  }
  const address = req.body.ethAddress;
  if (!address) {
    res.status(400).send({ message: "Invalid parameters" });
    return;
  }

  const balance = await provider.getBalance(address);
  const weiBalance = balance.toString();
  const ethBalance = ethers.utils.formatEther(weiBalance) + " ETH";

  const balanceEntity = new Balance({
    token: "ETH",
    address: address,
    balance: weiBalance,
    timestamp: Date.now(),
  });
  await balanceEntity.save();

  res.send(ethBalance);
}
