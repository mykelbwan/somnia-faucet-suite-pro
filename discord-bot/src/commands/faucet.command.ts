import {
  ChatInputCommandInteraction,
  MessageFlags,
} from "discord.js";
import { claimToken } from "../services/faucet.service";

export async function handleFaucet(
  interaction: ChatInputCommandInteraction
) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const token = interaction.options.getString("token", true);
  const wallet = interaction.options.getString("wallet", true);

  const result = await claimToken({
    token,
    wallet,
    username: interaction.user.username,
  });

  await interaction.editReply({ content: result });
}
