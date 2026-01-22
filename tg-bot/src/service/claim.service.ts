import axios from "axios";
import { TOKEN_CONFIG } from "../config/tokens";
import { parseClaimCommand } from "../utils/claimParser";
import {
  formatClaimError,
  formatClaimSuccess,
} from "../formatters/claim.formatter";

export async function handleClaim(
  match: RegExpMatchArray | null,
  username: string,
) {
  if (!match) {
    throw new Error("❌ Invalid command format");
  }

  const { command, wallet } = parseClaimCommand(match);

  const config = TOKEN_CONFIG[command];
  if (!config) {
    throw new Error(`❌ Unsupported token: ${command}`);
  }

  try {
    const res = await axios.get(config.endpoint, {
      params: {
        wallet,
        username,
        tokenSymbol: command,
        token: config.address,
      },
    });

    return formatClaimSuccess(res.data);
  } catch (err: any) {
    throw new Error(formatClaimError(err));
  }
}
