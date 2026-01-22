import axios from "axios";
import { formatStatusMessage } from "../formatters/status.formatter";
import { getSupportedTokens } from "../utils/tokenUtils";

export async function handleStatus(wallet: string, username: string) {
  const tokenList = getSupportedTokens();

  try {
    const res = await axios.get(
      `${process.env.MAIN_ENTRY}/api/faucet/claim-status`,
      {
        params: {
          wallet,
          username,
          tokens: tokenList,
        },
      }
    );

    return formatStatusMessage(wallet, res.data);
  } catch {
    throw new Error("❌ <b>Error:</b> Faucet server unreachable.");
  }
}
