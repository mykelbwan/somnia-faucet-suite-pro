import { bot } from "../bot";
import { isAdmin } from "../guards/admin.guard";
import { getHelpMessage } from "../service/help.service";

const HELP_REGEX = /^[!\/](help)(?:@\w+)?$/i;

bot.onText(HELP_REGEX, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const message = getHelpMessage(isAdmin(chatId));
    await bot.sendMessage(chatId, message, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  } catch (err) {
    await bot.sendMessage(chatId, "❌ Failed to load help message.");
  }
});
