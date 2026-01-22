import { Request, Response } from "express";
import { db } from "../db/lowdb.init.";

export async function getQueueStats(req: Request, res: Response) {
  try {
    // Ensure we have the latest data from the JSON file
    await db.read();

    const queue = db.data.queue || [];
    
    // Calculate some quick metrics
    const nativeClaims = queue.filter(item => item.type === 'native').length;
    const erc20Claims = queue.filter(item => item.type === 'erc20').length;

    res.json({
      queue_depth: queue.length,
      breakdown: {
        native: nativeClaims,
        erc20: erc20Claims
      },
      // Show the next 3 people in line 
      next_up: queue.slice(0, 3).map(item => ({
        username: item.username,
        type: item.type,
        wait_time: `${Math.floor((Date.now() - item.timestamp) / 1000)}s`
      })),
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}