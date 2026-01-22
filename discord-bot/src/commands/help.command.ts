import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { buildHelpMessage } from "../services/help.service";

export async function handleHelp(interaction: ChatInputCommandInteraction) {
  await interaction.reply({
    content: buildHelpMessage(),
    flags: MessageFlags.Ephemeral,
  });
}
