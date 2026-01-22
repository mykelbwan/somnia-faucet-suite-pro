import {
  getMonthKey,
  getTodayKey,
  getWeekKey,
} from "./faucetStatistics.service";
import { PeriodStatsJSON, TokenStatsJSON } from "../interface/faucet.interface";
import { readDB } from "../db/readdb.lowdb";
import { db } from "../db/lowdb.init.";

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

// --------------------
// Helper: Update Period Stats
// --------------------
function updatePeriodStats(
  stats: PeriodStatsJSON,
  wallet: string,
  username: string,
  amount: number,
) {
  stats.requests += 1;
  stats.totalVolume += amount;

  // In-memory Sets for fast uniqueness checks
  const walletSet = new Set(stats.uniqueWallets);
  const userSet = new Set(stats.uniqueUsers);

  if (!walletSet.has(wallet)) {
    walletSet.add(wallet);
    stats.uniqueWallets.push(wallet);
  }
  if (!userSet.has(username)) {
    userSet.add(username);
    stats.uniqueUsers.push(username);
  }
}

// --------------------
// Check cooldown
// --------------------
export async function isCoolDownActive(
  wallet: string,
  username: string,
  token: string,
): Promise<{ allowed: boolean; error?: string; timeLeft?: number }> {
  await readDB();

  const now = Date.now();
  const tokenUpper = token.toUpperCase();
  const walletKey = `${wallet.toLowerCase()}:${tokenUpper}`;
  const usernameKey = `${username}:${tokenUpper}`;

  const walletRecord = db.data.wallet_claims[walletKey];
  if (walletRecord) {
    const elapsed = now - walletRecord.last_claim;
    if (elapsed < TWENTY_FOUR_HOURS_MS) {
      return {
        allowed: false,
        timeLeft: TWENTY_FOUR_HOURS_MS - elapsed,
        error: "Wallet cooldown active.",
      };
    }
  }

  const userRecord = db.data.username_claims[usernameKey];
  if (userRecord) {
    const elapsed = now - userRecord.last_claim;
    if (elapsed < TWENTY_FOUR_HOURS_MS) {
      return {
        allowed: false,
        timeLeft: TWENTY_FOUR_HOURS_MS - elapsed,
        error: "Username cooldown active.",
      };
    }
  }

  return { allowed: true, timeLeft: 0 };
}

// --------------------
// Register claim + update all stats
// --------------------
export async function registerClaim(
  wallet: string,
  username: string,
  token: string,
  amount: number,
) {
  await readDB();

  const tokenKey = token.toUpperCase();
  const walletKey = `${wallet}:${tokenKey}`;
  const usernameKey = `${username}:${tokenKey}`;

  // Register cooldown
  db.data.wallet_claims[walletKey] = { last_claim: Date.now() };
  db.data.username_claims[usernameKey] = { last_claim: Date.now() };

  // Initialize token stats if missing
  if (!db.data.token_stats[tokenKey]) {
    db.data.token_stats[tokenKey] = {
      allTime: {
        requests: 0,
        uniqueWallets: [],
        uniqueUsers: [],
        totalVolume: 0,
      },
      daily: {},
      weekly: {},
      monthly: {},
    };
  }

  const tokenStats = db.data.token_stats[tokenKey] as TokenStatsJSON;

  // All-time
  updatePeriodStats(tokenStats.allTime, wallet, username, amount);

  // Daily
  const dayKey = getTodayKey();
  let dailyStart = tokenStats.daily[dayKey];

  if (!dailyStart) {
    dailyStart = {
      requests: 0,
      uniqueWallets: [],
      uniqueUsers: [],
      totalVolume: 0,
    };
    tokenStats.daily[dayKey] = dailyStart;
  }
  updatePeriodStats(dailyStart, wallet, username, amount);

  // Weekly
  const weekKey = getWeekKey();
  let weeklyStart = tokenStats.weekly[weekKey];

  if (!weeklyStart) {
    weeklyStart = {
      requests: 0,
      uniqueWallets: [],
      uniqueUsers: [],
      totalVolume: 0,
    };
    tokenStats.weekly[weekKey] = weeklyStart;
  }
  updatePeriodStats(weeklyStart, wallet, username, amount);

  // Monthly
  const monthKey = getMonthKey();
  let monthlyStats = tokenStats.monthly[monthKey];

  if (!monthlyStats) {
    monthlyStats = {
      requests: 0,
      uniqueWallets: [],
      uniqueUsers: [],
      totalVolume: 0,
    };
    tokenStats.monthly[monthKey] = monthlyStats; // persist to DB
  }
  updatePeriodStats(monthlyStats, wallet, username, amount);

  await db.write();
}
