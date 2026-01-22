import { faucetContract } from "../config/faucetContract";
import { parseSmartContractError } from "./contractErrorParser.service";

export async function claimNative(to: string, amount: bigint) {
  try {
    const tx = await (faucetContract as any).claimNative(to, amount);
    await tx.wait();
    return tx.hash;
  } catch (err: any) {
    const error = parseSmartContractError(err);
    console.error(`[ERC20 Claim Error]: ${error}`);
    throw new Error(error);
  }
}
