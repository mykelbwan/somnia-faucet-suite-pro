import { db } from "../db/lowdb.init.";
import { readDB } from "../db/readdb.lowdb";
import { PeriodStatsJSON } from "../interface/faucet.interface";

// --------------------
// Helper: Period keys
// --------------------
export function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
}

export function getWeekKey() {
  const date = new Date();
  const year = date.getFullYear();
  const week = Math.ceil(
    ((date.getTime() - new Date(date.getFullYear(), 0, 1).getTime()) /
      (1000 * 60 * 60 * 24) +
      new Date(date.getFullYear(), 0, 1).getDay() +
      1) /
      7
  );
  return `${year}-W${week}`;
}

export function getMonthKey() {
  const date = new Date();
  return `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
}

export async function getTokenStatsPeriod(
  token: string,
  period: "allTime" | "daily" | "weekly" | "monthly",
  key?: string // optional: specific day/week/month
) {
  await readDB();
  const tokenKey = token.toUpperCase();
  const tokenStats = db.data.token_stats[tokenKey];
  if (!tokenStats) return null;

  let stats: PeriodStatsJSON | undefined;

  switch (period) {
    case "allTime":
      stats = tokenStats.allTime;
      break;
    case "daily":
      stats = tokenStats.daily[key || getTodayKey()!];
      break;
    case "weekly":
      stats = tokenStats.weekly[key || getWeekKey()];
      break;
    case "monthly":
      stats = tokenStats.monthly[key || getMonthKey()];
      break;
  }

  if (!stats)
    return { requests: 0, uniqueWallets: 0, uniqueUsers: 0, totalVolume: 0 };

  return {
    requests: stats.requests,
    uniqueWallets: stats.uniqueWallets.length,
    uniqueUsers: stats.uniqueUsers.length,
    totalVolume: stats.totalVolume,
  };
}
