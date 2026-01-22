import { Request, Response } from "express";
import { checkBalance } from "../services/faucetHealthCheck.service";
import { db } from "../db/lowdb.init.";

export async function getFaucetBal(req: Request, res: Response) {
  try {
    // Run health check
    await checkBalance();

    // Return everything frontend needs
    return res.json({
      alerts: db.data.pending_alerts,
      balances: Object.entries(db.data.alerts).map(([symbol, a]) => ({
        token: symbol,
        status: a.lastStatus,
        balance: a.lastBalance,
        updatedAt: a.updatedAt,
      })),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch faucet health" });
  }
}