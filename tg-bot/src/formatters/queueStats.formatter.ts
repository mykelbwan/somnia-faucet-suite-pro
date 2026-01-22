import { QueueStatsData } from "../interface/queueStats.interface";

export function queueMessageFormatter(data: QueueStatsData): string {
  let statusIcon = data.queue_depth === 0 ? "💤" : "🟢";
  if (data.queue_depth > 10) statusIcon = "🟡";
  if (data.queue_depth > 50) statusIcon = "🔴";

  const nextUpList =
    data.next_up.length > 0
      ? data.next_up
          .map(
            (user, i) =>
              `
${i + 1}. <b>${user?.username}<b> (${user.type.toUpperCase()}) - ⏳ ${user?.wait_time}`,
          )
          .join("\n")
      : "<i>No pending requests.</i>";

  return `
<b>📊 Faucet Queue Statistics</b>

${statusIcon} <b>System Status:</b> ${data?.queue_depth === 0 ? "Idle" : "Processing"}
━━━━━━━━━━━━━━━━━━━━
<b>📥 Queue Depth:</b> ${data?.queue_depth}

<b>🔢 Breakdown:</b>
 • <b>Native (SOM):</b> ${data?.breakdown?.native}
 • <b>ERC20 Tokens:</b> ${data?.breakdown?.erc20}

<b>⏭️ Next Up:</b>
${nextUpList}

━━━━━━━━━━━━━━━━━━━━
<i>🕒 Updated: ${new Date(data.timestamp).toLocaleTimeString()}</i>
      `;
}
