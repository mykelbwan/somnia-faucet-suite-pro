import axios from "axios";
import { tokenList } from "../config/tokens";
import { claimStatus } from "../routes/routes.route";

export async function fetchStatus(wallet: string, username: string) {
  const res = await axios.get(claimStatus, {
    params: { wallet, username, tokenList },
  });

  return Object.entries(res.data)
    .map(
      ([token, time]) =>
        `${time === "Ready" ? "✅" : "⏳"} **${token}:** ${time}`,
    )
    .join("\n");
}
