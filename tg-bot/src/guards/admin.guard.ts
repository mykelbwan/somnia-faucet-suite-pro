import { admin_ids } from "../config/admins";

export function isAdmin(chatId: number) {
  return admin_ids.includes(Number(chatId));
}
