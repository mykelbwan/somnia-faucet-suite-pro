import { bot } from "../bot";
import { handleStatus } from "../service/status.service";


const STATUS_REGEX = /^[!\/]status\s+(0x[a-fA-F0-9]{40})$/i;

bot.onText(STATUS_REGEX, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = msg.from?.username || msg.from?.first_name || "unknown";
  const wallet = match?.[1];

  if (!wallet) {
    return bot.sendMessage(chatId, "❌ Invalid wallet address");
  }

  try {
    bot.sendChatAction(chatId, "typing");

    const message = await handleStatus(wallet, username);
    await bot.sendMessage(chatId, message, { parse_mode: "HTML" });
  } catch (err: any) {
    await bot.sendMessage(
      chatId,
      err.message || "❌ <b>Error:</b> Faucet server unreachable.",
      { parse_mode: "HTML" }
    );
  }
});
