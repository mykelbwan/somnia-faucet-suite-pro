import { faucetContract } from "../config/faucetContract";
import { parseSmartContractError } from "./contractErrorParser.service";

export async function claimERC20Token(
  to: string,
  tokenAddress: string,
  amount: bigint,
) {
  try {
    const tx = await (faucetContract as any).claimERC20(
      tokenAddress,
      to,
      amount,
    );
    await tx.wait();
    return tx.hash;
  } catch (err: any) {
    const cleanError = parseSmartContractError(err);
    console.error(`[Native Claim Error]: ${cleanError}`);
    throw new Error(cleanError);
  }
}
