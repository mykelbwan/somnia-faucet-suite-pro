import { formatAlert } from "../formatters/checkBal.formatter";
import { acknowledgeAlerts, fetchFaucetAlerts } from "./faucetApi.service";
import { sendAdminNotification } from "./telegramNotifier.service";

export async function runFaucetBalanceCheck(triggerAdminId: number) {
  const alerts = await fetchFaucetAlerts(triggerAdminId);

  if (!alerts.length) {
    return;
  }

  await notifyAdmins(alerts);
  await acknowledgeAlerts(triggerAdminId);
}

async function notifyAdmins(alerts: any[]) {
  for (const alert of alerts) {
    const message = formatAlert(alert);
    await sendAdminNotification(message);
  }
}
