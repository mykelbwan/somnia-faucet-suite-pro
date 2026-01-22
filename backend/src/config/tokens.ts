import { TokenSettings } from "../interface/faucet.interface";

/**
 * this is where we add supported tokens
 */

export const TOKEN_CONFIG: Record<string, TokenSettings> = {
  STT: {
    address: null,
    low: 500, // threshold
    decimals: 18,
  },

  FS: {
    address: "0x174bfb87F8B69619352879fd66116b705121efe6",
    low: 1_000, // threshold
    decimals: 18,
  },
} as const;

export type TokenSymbol = keyof typeof TOKEN_CONFIG;
