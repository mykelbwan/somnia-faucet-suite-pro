export function formatAlert(alert: any) {
  return `⚠️ *${
    alert.symbol
  }*\nStatus: _${alert.status.toUpperCase()}_\nBalance: ${
    alert.balance
  }\nMessage: ${alert.message}`;
}