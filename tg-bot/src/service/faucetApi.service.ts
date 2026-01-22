import axios from "axios";
import { checkBal, clearNotif } from "../config/routes";

export async function fetchFaucetAlerts(adminId: number) {
  const res = await axios.get(checkBal, {
    headers: { "x-telegram-id": adminId },
  });

  return res.data?.alerts ?? [];
}

export async function acknowledgeAlerts(adminId: number) {
  await axios.post(
    clearNotif,
    {},
    { headers: { "x-telegram-id": adminId } }
  );
}
