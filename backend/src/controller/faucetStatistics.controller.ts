import { Request, Response } from "express";
import { getTokenStatsPeriod } from "../services/faucetStatistics.service";

export async function getFaucetStats(req: Request, res: Response) {
  try {
    const { token, period, key } = req.query;

    if (!token || !period)
      return res.status(400).json({ error: "Missing param" });

    const stats = await getTokenStatsPeriod(
      token as string,
      period as any,
      key as string | undefined,
    );

    return res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
}
