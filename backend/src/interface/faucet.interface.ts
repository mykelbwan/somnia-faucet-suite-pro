interface ClaimRecord {
  last_claim: number;
}
export type AlertStatus = "ok" | "low" | "empty";

export interface QueueItem {
  id: string;
  wallet: string;
  username: string;
  tokenSymbol: string;
  tokenAddress?: string | undefined;
  amount: string;
  type: "native" | "erc20"; // Support both claim types
  timestamp: number;
  status: "pending" | "processing" | "failed";
}

export interface AlertState {
  lastStatus: AlertStatus;
  lastBalance: number;
  updatedAt: number;
}
export interface PendingAlert {
  symbol: string;
  status: AlertStatus;
  balance: number;
  message: string;
  createdAt: number;
}

export interface PeriodStatsJSON {
  requests: number;
  uniqueWallets: string[];
  uniqueUsers: string[];
  totalVolume: number;
}

export interface TokenStatsJSON {
  allTime: PeriodStatsJSON;
  daily: Record<string, PeriodStatsJSON>;
  weekly: Record<string, PeriodStatsJSON>;
  monthly: Record<string, PeriodStatsJSON>;
}

export interface DBData {
  wallet_claims: Record<string, ClaimRecord>;
  username_claims: Record<string, ClaimRecord>;
  token_stats: Record<string, TokenStatsJSON>;
  alerts: Record<string, AlertState>;
  pending_alerts: PendingAlert[];
  queue: QueueItem[];
}

// Tokens interface
export interface TokenSettings {
  address: string | null;
  low: number;
  decimals: number;
}
