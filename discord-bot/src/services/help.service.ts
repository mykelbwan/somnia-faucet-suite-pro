import { TOKEN_CONFIG } from "../config/tokens";

export function buildHelpMessage() {
  const tokens = Object.keys(TOKEN_CONFIG)
    .map((t) => `• \`${t}\``)
    .join("\n");

  return `
🚀 **Somnia Faucet Guide**

**Commands**
• \`/faucet\`
• \`/status\`
• \`/help\`

**Supported Tokens**
${tokens}

Each token has a 24h cooldown.
`;
}
