import { claimERC, claimNative } from "./routes";
import { TokenSettings } from "../interface/interface";

export const TOKEN_CONFIG: Record<string, TokenSettings> = {
  STT: {
    endpoint: claimNative,
    address: null,
  },

  FS: {
    endpoint: claimERC,
    address: "0x174bfb87F8B69619352879fd66116b705121efe6",
  },
};

const tokenPattern = Object.keys(TOKEN_CONFIG).join("|");
export const FAUCET_REGEX = new RegExp(
  `^(?:!(${tokenPattern})|[/]help\\s+(${tokenPattern}))\\s+(0x[a-fA-F0-9]{40})`,
  "i"
);

export type TokenSymbol = keyof typeof TOKEN_CONFIG;
