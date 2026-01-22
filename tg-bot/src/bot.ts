import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import { faucetBalanceJob } from "./cronJob/faucetMonitor";

const { TELEGRAM_BOT_TOKEN } = process.env;
if (!TELEGRAM_BOT_TOKEN) throw new Error("Invalid Telegram bot token");
export const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

import "./handlers/claim";
import "./handlers/start";
import "./handlers/stats";
import "./handlers/status";
import "./handlers/statsCallBack";
import "./handlers/help";
import "./handlers/faucetBalanceCheck";
import "./handlers/queueStats";
import { registerCommands } from "./ui/commands";

bot.on("polling_error", ({ message, stack }) => {
  if (message === "EFATAL") {
    console.log("[Telegram] Connection lost. Reconnecting...");
  } else {
    console.error("⚠️ [Telegram] Polling error:", message, stack);
  }
});
// register commands
registerCommands();

// Cron job runs every 2 hours:
// - Checks the balance of each faucet token
// - If a token’s balance is below its threshold, it sends an alert to the admins
faucetBalanceJob.start();
