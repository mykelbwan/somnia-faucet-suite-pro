export interface QueueStatsData {
  queue_depth: number;
  breakdown: { native: number; erc20: number };
  next_up: { username: string; type: string; wait_time: string }[];
  timestamp: string;
}
