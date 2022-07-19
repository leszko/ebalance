import { sendError } from "next/dist/server/api-utils";

const ethers = require("ethers");
const provider = new ethers.providers.JsonRpcProvider(
  "https://arb1.arbitrum.io/rpc"
);

export default async function handler(req, res) {
  const address = req.query.ethAddress;
  const balance = await provider.getBalance(address);
  const weiBalance = balance.toString();
  const ethBalance = ethers.utils.formatEther(weiBalance) + " ETH";
  res.send(ethBalance);
}
