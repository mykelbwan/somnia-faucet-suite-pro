import { formatUnits } from "ethers";
import { faucetContract } from "../config/faucetContract";
import { TOKEN_CONFIG, TokenSymbol } from "../config/tokens";
import { db } from "../db/lowdb.init.";
import { AlertStatus } from "../interface/faucet.interface";

export async function checkBalance() {
  for (const [symbol, token] of Object.entries(TOKEN_CONFIG)) {
    const bal = token.address
      ? await (faucetContract as any).getBalErc20(token.address)
      : await (faucetContract as any).getBalNative();

    const normalizedBalance = Number(formatUnits(bal, token.decimals));
    await evaluateToken(symbol, normalizedBalance);
  }
}

async function evaluateToken(symbol: TokenSymbol, balance: number) {
  const token = TOKEN_CONFIG[symbol];

  if (!token) throw new Error("Invalid symbol from FAUCET ALERTS file");

  const status = getStatus(balance, token.low);
  const last = db.data.alerts[symbol]?.lastStatus ?? "ok";

  if (status !== "ok") {
    const message = buildAlertMessage(symbol, balance, status);

    db.data.pending_alerts.push({
      symbol,
      status,
      balance,
      message,
      createdAt: Date.now(),
    });

    db.data.alerts[symbol] = {
      lastStatus: status,
      lastBalance: balance,
      updatedAt: Date.now(),
    };

    await db.write();
  }
}

function buildAlertMessage(
  symbol: string,
  balance: number,
  status: AlertStatus,
) {
  if (status === "low")
    return `⚠️ ${symbol} faucet balance is LOW\nCurrent: ${balance}`;

  if (status === "empty")
    return `🔴 ${symbol} faucet is EMPTY\nClaims are failing`;

  return `🟢 ${symbol} faucet refilled\nCurrent: ${balance}`;
}

function getStatus(balance: number, low: number) {
  if (balance === 0) return "empty";
  if (balance <= low) return "low";
  return "ok";
}
