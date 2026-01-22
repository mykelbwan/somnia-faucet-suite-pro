import { JSONFile } from "lowdb/node";
import fs from "fs";
import { DBData } from "../interface/faucet.interface";
import { Low } from "lowdb";
import path from "path";

const DEFAULT_DATA: DBData = {
  wallet_claims: {},
  username_claims: {},
  token_stats: {},
  alerts: {},
  pending_alerts: [],
  queue: [],
};
const dbPath = path.resolve(process.cwd(), "faucet.json");

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify(DEFAULT_DATA, null, 2));
}

const adapter = new JSONFile<DBData>(dbPath);

export const db = new Low<DBData>(adapter, DEFAULT_DATA);

export async function initDB() {
  await db.read();

  // if DB is empty, initialize it
  db.data ||= DEFAULT_DATA;

  // Ensure queue exists if using an old DB file
  if (!db.data.queue) {
    db.data.queue = [];
  }

  await db.write();
}
