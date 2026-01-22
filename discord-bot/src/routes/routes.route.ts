import "dotenv/config";

const MAIN_ENTRY = process.env.MAIN_ENTRY;

if (!MAIN_ENTRY) throw new Error("Backend Main entry point is Undefined");

export const claimNative = `${MAIN_ENTRY}/api/faucet/claim-stt`;
export const claimERC = `${MAIN_ENTRY}/api/faucet/claim-erc20`;
export const claimStatus = `${MAIN_ENTRY}/api/faucet/claim-status`;
