export function formatStatsMessage(
  token: string,
  period: string,
  stats: any
) {
  return `
📊 *Faucet Stats*

*Token:* ${token}
*Period:* ${period}

• Requests: ${stats.requests}
• Unique wallets: ${stats.uniqueWallets}
• Unique users: ${stats.uniqueUsers}
• Total volume: ${stats.totalVolume}
`;
}
