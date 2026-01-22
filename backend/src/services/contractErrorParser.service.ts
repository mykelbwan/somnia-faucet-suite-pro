import { faucetContract } from "../config/faucetContract";

export function parseSmartContractError(err: any): string {
  if (err.data && faucetContract.interface) {
    try {
      const decoded = faucetContract.interface.parseError(err.data);
      if (decoded) return `Contract Error: ${decoded.name}`;
    } catch (e) {
      console.error("Failed to decode error fragment:", e);
    }
  }

  if (err.reason) return err.reason;
  if (err.shortMessage) return err.shortMessage;

  const selectors: Record<string, string> = {
    "0xad3a8b9e": "InvalidToken: This token is not supported by the faucet.",
    "0x08c379a0": "Error: Generic revert with string message.",
  };

  if (err.data && selectors[err.data]) {
    return selectors[err.data]!;
  }

  return "Blockchain Error: The transaction was reverted by the network.";
}
