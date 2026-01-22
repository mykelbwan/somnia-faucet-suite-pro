import { Interaction } from "discord.js";
import { handleHelp } from "../commands/help.command";
import { handleFaucet } from "../commands/faucet.command";
import { handleStatus } from "../commands/status.commnd";


export async function onInteraction(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;

  switch (interaction.commandName) {
    case "faucet":
      return handleFaucet(interaction);

    case "status":
      return handleStatus(interaction);

    case "help":
      return handleHelp(interaction);
  }
}
