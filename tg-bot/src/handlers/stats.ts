import { bot } from "../bot";
import { isAdmin } from "../guards/admin.guard";
import { adminStatsStates } from "../interface/interface";
import { tokenButtons } from "../ui/buttons";

bot.onText(/^\/faucet_stats$/, async (msg) => {
  const chatId = msg.chat.id;

  if (!isAdmin(chatId)) {
    return bot.sendMessage(chatId, "⛔ Admin only");
  }

  adminStatsStates.set(chatId, {});

  await bot.sendMessage(chatId, "📊 Select token:", {
    reply_markup: { inline_keyboard: tokenButtons },
  });
});
