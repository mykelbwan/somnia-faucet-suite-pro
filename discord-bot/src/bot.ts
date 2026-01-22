import "dotenv/config";
import { registerCommands } from "./registerCommands";
import { onInteraction } from "./listeners/interaction.listeners";
import { client } from "./client";

const { DISCORD_BOT_TOKEN } = process.env;

if (!DISCORD_BOT_TOKEN) {
  throw new Error("Missing Discord Bot Token ENV");
}

client.once("ready", async () => {
  console.log("🤖 Discord bot online");
  try {
    await registerCommands();
  } catch (err: any) {
    console.log("Failed to register commands:", err);
  }
});

client.on("interactionCreate", onInteraction);

client.login(DISCORD_BOT_TOKEN);
