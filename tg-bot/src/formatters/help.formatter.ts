import { TOKEN_CONFIG } from "../config/tokens";

export function buildHelpMessage(isAdmin = false) {
  const tokenList = Object.keys(TOKEN_CONFIG);
  const tokenCommands = tokenList.map((t) => `• <code>!${t}</code>`).join("\n");

  let message = `
<b>🚀 Somnia Faucet Guide</b>

<b>Commands:</b>
• <code>!status [WALLET]</code> — Check cooldowns
• <code>!help</code> — Show this guide

<b>Claiming Tokens:</b>
<code>![TOKEN] [WALLET]</code>

<b>Supported Assets:</b>
${tokenCommands}

<b>Example:</b>
<code>!STT 0x123...456</code>

<i>Each token has an individual 24h cooldown.</i>
`;

  if (isAdmin) {
    message += `

<b>⚡ Admin Commands:</b>
• <code>/faucet_check</code> — Run a manual faucet health check
• <code>/faucet_stats</code> — View faucet stats per token/period
• <code>/queue_stats</code>  — View request Queue
`;
  }

  return message;
}
