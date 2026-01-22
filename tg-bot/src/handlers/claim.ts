import { bot } from "../bot";
import { FAUCET_REGEX } from "../config/tokens";
import { handleClaim } from "../service/claim.service";



bot.onText(FAUCET_REGEX, async (msg, match) => {
  const chatId = msg.chat.id;
  const username = msg.from?.username || msg.from?.first_name || "unknown";

  try {
    const message = await handleClaim(match, username);
    await bot.sendMessage(chatId, message, { parse_mode: "HTML" });
  } catch (err: any) {
    await bot.sendMessage(
      chatId,
      err.message || "❌ Something went wrong",
      { parse_mode: "HTML" }
    );
  }
});
