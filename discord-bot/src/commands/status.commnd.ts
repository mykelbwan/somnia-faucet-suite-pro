import {
  ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";
import { fetchStatus } from "../services/status.service";

export async function handleStatus(
  interaction: ChatInputCommandInteraction
) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const wallet = interaction.options.getString("wallet", true);

  const message = await fetchStatus(wallet, interaction.user.username);

  await interaction.editReply({ content: message });
}
