import { bot } from "../bot";
import { queueMessageFormatter } from "../formatters/queueStats.formatter";
import { isAdmin } from "../guards/admin.guard";
import { getQueueStats } from "../service/queueStats.service";

const QueueStats = /^[!\/](queue_stats)(?:@\w+)?$/i;

bot.onText(QueueStats, async (msg) => {
  const adminId = msg.from?.id;

  if (!adminId)
    throw new Error("Invalid adminID in queueStats.ts handler file");

  if (!isAdmin(adminId)) {
    return bot.sendMessage(adminId, "⛔ Admin only");
  }

  const stats = await getQueueStats(adminId);
  if (!stats) {
    return await bot.sendMessage(
      adminId,
      "⚠️ Could not fetch stats. Is the server running?",
    );
  }

  const message = queueMessageFormatter(stats);

  await bot.sendMessage(adminId, message, { parse_mode: "HTML" });
});
