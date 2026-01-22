import { db } from "./lowdb.init.";

export async function readDB() {
  try {
    await db.read();
    db.data ||= {
      wallet_claims: {},
      username_claims: {},
      token_stats: {},
      alerts: {},
      pending_alerts: [],
      queue: [],
    };
  } catch (err) {
    console.error("[DB Error] faucet.json malformed. Resetting...");
    db.data = {
      wallet_claims: {},
      username_claims: {},
      token_stats: {},
      alerts: {},
      pending_alerts: [],
      queue: [],
    };
    await db.write();
  }
}
