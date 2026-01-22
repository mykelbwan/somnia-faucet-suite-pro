import axios from "axios";
import { TOKEN_CONFIG } from "../config/tokens";
import { isValidWallet } from "../utils/validateWallet";

export async function claimToken({
  token,
  wallet,
  username,
}: {
  token: string;
  wallet: string;
  username: string;
}) {
  if (!isValidWallet(wallet)) {
    return "❌ Invalid wallet format.";
  }

  const config = TOKEN_CONFIG[token];
  if (!config) throw new Error("Invalid token");

  const res = await axios.get(config.endpoint, {
    params: {
      wallet,
      username,
      tokenSymbol: token,
      token: config.address,
    },
  });

  const { status, message, explorer, note } = res.data;

  return `
✅ ${status}

${message}

${explorer}

${note}
`;
}
