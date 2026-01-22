import { bot } from "../bot";

export async function registerCommands() {
  try {
    await bot.setMyCommands([
      {
        command: "faucet_check",
        description: "Run a faucet balance check (Admin only)",
      },
      {
        command: "faucet_stats",
        description: "Fetch token stats from the faucet (Admin only)",
      },
      {
        command: "help",
        description: "Get instructions on how to use the faucet",
      },
      {
        command: "queue_stats",
        description: "Get the faucet claim queue statistics",
      },
    ]);
    console.log("commands registered");
  } catch (err: any) {
    console.error("Failed to register commands:", err);
  }
}
