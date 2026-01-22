import { Request, Response } from "express";
import { isCoolDownActive } from "../services/faucetRateLimiter.service";
import { formatCooldown } from "../utils/timeFormat";

export async function getClaimStatus(req: Request, res: Response) {
  try {
    const wallet = ((req.query.wallet as string) || "").toLowerCase();
    if (!wallet) return res.status(400).json({ error: "wallet expected" });
    const username = (req.query.username as string) || "";
    const tokensRaw = req.query.tokens as string;

    if (!tokensRaw) {
      return res.status(400).json({ error: "No tokens provided" });
    }

    const tokenList = tokensRaw.split(",").map((s) => s.trim());
    const statusReport: Record<string, string> = {};

    for (const symbol of tokenList) {
      const check = await isCoolDownActive(wallet, username, symbol);

      if (check.allowed) {
        statusReport[symbol] = "Ready";
      } else {
        statusReport[symbol] = formatCooldown(check.timeLeft || 0);
      }
    }

    console.log(`[STATUS CHECK] User: ${username} | Results:`, statusReport);

    res.json(statusReport);
  } catch (err: any) {
    console.error("Status Check Error:", err.message);
    res.status(500).json({ error: err.message });
  }
}
