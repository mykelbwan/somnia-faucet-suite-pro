import { bot } from "../bot";
import { admin_ids } from "../config/admins";

export async function sendAdminNotification(message: string) {
  for (const chatId of admin_ids) {
    if (!chatId) continue;

    try {
      await bot.sendMessage(chatId, message, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
      });
      console.log(`Admin ${chatId} notified successfully.`);
    } catch (err) {
      console.error(`Failed to notify admin ${chatId}:`, err);
    }
  }
}
