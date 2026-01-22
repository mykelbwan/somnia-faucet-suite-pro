import axios from "axios";
import { queueStatsUrl } from "../config/routes";

export async function getQueueStats(adminId: number) {
  try {
    const res = await axios.get(queueStatsUrl, {
      headers: {
        "x-telegram-id": String(adminId),
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (err: any) {
    console.log(err);

    console.error(
      `❌ Bot Axios Error: ${err.response?.status} - ${err.message}`,
    );
    if (err.response) {
      console.log("Response Data:", err.response.data);
    }
    return null;
  }
}
