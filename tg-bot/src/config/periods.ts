export const PERIODS = ["allTime", "daily", "weekly", "monthly"] as const;

export type Periods = (typeof PERIODS)[number];
