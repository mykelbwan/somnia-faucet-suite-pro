import { bot } from "../bot";

bot.onText(/^\/start$/, async (msg) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(
    chatId,
    "👋 Welcome to the Somnia Faucet Bot!\nUse /help or !help to see commands."
  );
});
