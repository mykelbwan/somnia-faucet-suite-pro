import { bot } from "../bot";
import { PERIODS, Periods } from "../config/periods";
import { TokenSymbol } from "../config/tokens";
import { formatStatsMessage } from "../formatters/stats.formatter";
import { isAdmin } from "../guards/admin.guard";
import { adminStatsStates } from "../interface/interface";
import { getFaucetStat } from "../service/stats.service";


bot.on("callback_query", async (query) => {
  if (!query.data || !query.message) return;

  const chatId = query.message.chat.id;

  if (!isAdmin(chatId)) {
    return bot.sendMessage(chatId, "⛔ Admin only");
  }
  const state = adminStatsStates.get(chatId) || {};

  /* TOKEN SELECT */
  if (query.data.startsWith("stats_token:")) {
    const token = query.data.split(":")[1] as TokenSymbol;

    state.token = token;
    adminStatsStates.set(chatId, state);

    return bot.sendMessage(chatId, "📆 Select period:", {
      reply_markup: {
        inline_keyboard: PERIODS.map((p) => [
          { text: p, callback_data: `stats_period:${p}` },
        ]),
      },
    });
  }

  /* PERIOD SELECT */
  if (query.data.startsWith("stats_period:")) {
    const period = query.data.split(":")[1] as Periods;

    if (!state.token) {
      return bot.sendMessage(chatId, "❌ Token not selected.");
    }

    state.period = period;
    adminStatsStates.set(chatId, state);

    const stats = await getFaucetStat(chatId, state.token, state.period);

    if (!stats) {
      return bot.sendMessage(chatId, "No stats available.");
    }

    const message = formatStatsMessage(state.token, state.period, stats);
    adminStatsStates.delete(chatId);

    return bot.sendMessage(chatId, message, { parse_mode: "Markdown" });
  }
});
