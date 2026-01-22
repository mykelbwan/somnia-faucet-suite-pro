const MAIN_ENTRY = process.env.MAIN_ENTRY;

if (!MAIN_ENTRY) throw new Error("Back-end main entry url is undefined");

export const queueStatsUrl = `${MAIN_ENTRY}/api/faucet/admin/queue-stats`;
export const checkBal = `${MAIN_ENTRY}/api/faucet/admin/faucet-balances`;
export const faucetSats = `${MAIN_ENTRY}/api/faucet/admin/faucet-stats`;
export const clearNotif = `${MAIN_ENTRY}/api/faucet/admin/alerts/acknowledge`; // post

export const claimNative = `${MAIN_ENTRY}/api/faucet/claim-stt`;
export const claimERC = `${MAIN_ENTRY}/api/faucet/claim-erc20`;
