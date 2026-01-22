import { Periods } from "../config/periods";
import type { TokenSymbol } from "../config/tokens";

export interface TokenSettings {
  endpoint: string;
  address: string | null;
}

export interface AdminStatsState {
  token?: TokenSymbol;
  period?: Periods;
  key?: string;
}

export const adminStatsStates = new Map<number, AdminStatsState>();
