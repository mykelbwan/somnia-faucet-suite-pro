export function parseClaimCommand(match: RegExpMatchArray) {
  const command = (match[1] || match[2])?.toUpperCase();
  const wallet = match[3];

  if (!command || !wallet) {
    throw new Error("❌ Invalid claim command");
  }

  return { command, wallet };
}
