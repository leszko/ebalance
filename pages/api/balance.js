const ethers = require("ethers");
const fs = require("fs");
const Balance = require("./db/balance.js");

// Configure connection to ETH RPC
const provider = new ethers.providers.JsonRpcProvider(
  "https://arb1.arbitrum.io/rpc"
);
const bondingManagerContractAddress =
  "0x35Bcf3c30594191d53231E4FF333E8A770453e40";

const bondingManagerContractAbi = require("./abis/BondingManager.js");

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
  asyncCall = req.body.async;
  if (asyncCall) {
    res.send("")
  }

  // Get ETH Balance
  const balance = await provider.getBalance(address);
  const weiBalance = balance.toString();

  // Get LPT Balance bound in the Livepeer contract
  const bondingManagerContract = new ethers.Contract(
    bondingManagerContractAddress,
    bondingManagerContractAbi,
    provider
  );
  const delegator = await bondingManagerContract.functions.getDelegator(
    address
  );
  const uLpt = delegator.delegatedAmount.toString();

  // Get fees in the Livepeer contract
  const transcoder = await bondingManagerContract.functions.getTranscoder(
    address
  );
  const round = transcoder.lastActiveStakeUpdateRound;
  const transcoderEarnings = await bondingManagerContract.functions.pendingFees(address, round);
  const fees = transcoderEarnings.toString();

  const balanceEntity = new Balance({
    address: address,
    timestamp: Date.now(),
    tokens: { ETH: weiBalance, lLPT: uLpt, lETH: fees, },
  });
  await balanceEntity.save();

  if (!asyncCall) {
    res.send({
      ETH: ethers.utils.formatEther(weiBalance),
      lLPT: ethers.utils.formatEther(uLpt),
      lETH: ethers.utils.formatEther(fees)
    });
  }
}
