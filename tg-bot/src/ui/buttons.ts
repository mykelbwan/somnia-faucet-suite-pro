import { PERIODS } from "../config/periods";
import { TOKEN_CONFIG } from "../config/tokens";

export const tokenButtons = Object.keys(TOKEN_CONFIG).map((t) => [
  { text: t, callback_data: `stats_token:${t}` },
]);

export const periodButtons = PERIODS.map((p) => [
  { text: p, callback_data: `stats_period:${p}` },
]);