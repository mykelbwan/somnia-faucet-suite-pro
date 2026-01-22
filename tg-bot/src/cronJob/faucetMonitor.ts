import { CronJob } from "cron";
import "dotenv/config";
import { runFaucetBalanceCheck } from "../service/faucetBalanceCheck.service";

const { SERVER_ID } = process.env;

if (!SERVER_ID) {
  throw new Error("SERVER_ID missing from .env");
}

/**
 * Runs every 5 hours at minute 0
 *  "0 *_/5 * * * "
 */

export const faucetBalanceJob = new CronJob(
  "0 */5 * * *", // run every 5 hours
  // "*/10 * * * * *", // run every 10 seconds for testing

  async () => {
    try {
      await runFaucetBalanceCheck(Number(SERVER_ID));
    } catch (err: any) {
      console.error("❌ Faucet cron failed:", err.message);
    }
  },

  null, // onComplete
  false, // Don't start yet
  "UTC", // in UTC time
);
