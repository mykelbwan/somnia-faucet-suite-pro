import "dotenv/config";
import {
  REST,
  RESTPostAPIApplicationCommandsJSONBody,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
import { tokenChoices } from "./config/tokens";

const { DISCORD_BOT_TOKEN, BOT_ID } = process.env;

export const commands: RESTPostAPIApplicationCommandsJSONBody[] = [
  new SlashCommandBuilder()
    .setName("faucet")
    .setDescription("Claim testnet tokens")
    .addStringOption((option) =>
      option
        .setName("token")
        .setDescription("Select the token")
        .setRequired(true)
        .addChoices(...tokenChoices),
    )
    .addStringOption((option) =>
      option
        .setName("wallet")
        .setDescription("Your 0x wallet address")
        .setRequired(true),
    )
    .toJSON(),

  new SlashCommandBuilder()
    .setName("help")
    .setDescription("Learn how to use the Somnia Faucet")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("status")
    .setDescription("Check your current token cooldowns")
    .addStringOption((option) =>
      option
        .setName("wallet")
        .setDescription("The 0x wallet address to check")
        .setRequired(true),
    )
    .toJSON(),
];

export async function registerCommands() {
  if (!DISCORD_BOT_TOKEN || !BOT_ID) {
    throw new Error("Missing Discord env vars");
  }

  const rest = new REST({ version: "10" }).setToken(DISCORD_BOT_TOKEN);

  await rest.put(Routes.applicationCommands(BOT_ID), {
    body: commands,
  });

  console.log("✅ Discord slash commands registered");
}
