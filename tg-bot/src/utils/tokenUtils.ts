import { TOKEN_CONFIG } from "../config/tokens";

export function getSupportedTokens(): string {
  return Object.keys(TOKEN_CONFIG).join(",");
}
