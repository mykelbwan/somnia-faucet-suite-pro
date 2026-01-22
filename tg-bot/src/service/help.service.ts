import { buildHelpMessage } from "../formatters/help.formatter";

export function getHelpMessage(is_admin: boolean) {
  return buildHelpMessage(is_admin);
}
