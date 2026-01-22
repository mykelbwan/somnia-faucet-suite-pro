import { isAddress } from "ethers";
import { Request, Response } from "express";
import { isCoolDownActive } from "../services/faucetRateLimiter.service";
import { sttAmount } from "../config/claimAmounts";
import { addToQueue, processQueue } from "../services/queue.service";

export async function claimSomnia(req: Request, res: Response) {
  try {
    const wallet = ((req.query.wallet as string) || "").toLowerCase();
    const username = req.query.username as string;
    const tokenSymbol = req.query.tokenSymbol as string;

    if (!wallet) return res.status(400).json({ error: "wallet expected" });
    if (!username) return res.status(400).json({ error: "username expected" });
    if (!isAddress(wallet))
      return res.status(400).json({ error: "Invalid wallet address" });

    // Rate limit check
    const check = await isCoolDownActive(wallet, username, tokenSymbol);
    if (!check.allowed) {
      return res.status(429).json({ error: check.error });
    }

    await addToQueue(wallet, username, tokenSymbol, sttAmount, "native");

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
