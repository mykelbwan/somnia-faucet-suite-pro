import { TokenSettings } from "../interface/tokenSettings";
import { claimERC, claimNative } from "../routes/routes.route";

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

export const tokenChoices = Object.keys(TOKEN_CONFIG).map((symbol) => ({
  name: `${symbol} ${symbol === "STT" ? "(Native)" : "(ERC20)"}`,
  value: symbol,
}));

export const tokenList = Object.keys(TOKEN_CONFIG).join(",");
