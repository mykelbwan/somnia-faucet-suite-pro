import axios from "axios";
import { faucetSats } from "../config/routes";

export async function getFaucetStat(
  adminId: number,
  token: string,
  period: string,
  key?: string | null
) {
  const res = await axios.get(faucetSats, {
    headers: { "x-telegram-id": adminId },
    params: {
      token,
      period,
      key,
    },
  });

  return await res.data;
}
