import { Request, Response } from "express";
import { db } from "../db/lowdb.init.";

export async function acknowledgeAlerts(req: Request, res: Response) {
  try {
    const count = db.data.pending_alerts.length;

    db.data.pending_alerts = [];
    await db.write();

    return res.json({
      success: true,
      cleared: count,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to acknowledge alerts" });
  }
}
