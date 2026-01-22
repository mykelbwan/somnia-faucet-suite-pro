import { bot } from "../bot";
import { isAdmin } from "../guards/admin.guard";
import { runFaucetBalanceCheck } from "../service/faucetBalanceCheck.service";

const FAUCET_CHECK_REGEX = /\/faucet_check/i;

bot.onText(FAUCET_CHECK_REGEX, async (msg) => {
  const chatId = msg.chat.id;

  if (!isAdmin(chatId)) {
    return bot.sendMessage(chatId, "⛔ Admin only");
  }

  try {
    await runFaucetBalanceCheck(chatId);
    await bot.sendMessage(chatId, "✅ Faucet health check executed");
  } catch (err: any) {
    console.error("Faucet check failed:", err);
    await bot.sendMessage(chatId, err?.data?.error);
  }
});
