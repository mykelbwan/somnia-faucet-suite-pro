import { isAddress } from "ethers";
import { Request, Response } from "express";
import { erc20ClaimAmount } from "../config/claimAmounts";
import { isCoolDownActive } from "../services/faucetRateLimiter.service";
import { addToQueue, processQueue } from "../services/queue.service";

export async function claimERC20(req: Request, res: Response) {
  try {
    const wallet = ((req.query.wallet as string) || "").toLowerCase();
    const token = req.query.token as string;
    const tokenSymbol = req.query.tokenSymbol as string;
    const username = req.query.username as string;

    if (!wallet) return res.status(400).json({ error: "wallet expected" });
    if (!token) return res.status(400).json({ error: "token expected" });
    if (!username) return res.status(400).json({ error: "username expected" });
    if (!isAddress(wallet) || !isAddress(token))
      return res.status(400).json({ error: "Invalid input" });

    // Rate limiter
    const check = await isCoolDownActive(wallet, username, tokenSymbol);
    if (!check.allowed) {
      return res.status(429).json({ error: check.error });
    }

    await addToQueue(
      wallet,
      username,
      tokenSymbol,
      erc20ClaimAmount,
      "erc20",
      token,
    );

    // Ensure processing has started just in case server was idle
    processQueue();

    res.status(202).json({
      status: "Queued",
      message: `Claim for ${tokenSymbol} has been added to the processing queue.`,
      explorer: `https://shannon-explorer.somnia.network/address/${wallet}`,
      note: "Transactions are processed one-by-one. Check the explorer in 1-2 minutes.",
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
