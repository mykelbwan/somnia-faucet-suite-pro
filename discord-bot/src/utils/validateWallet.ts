export function isValidWallet(wallet: string) {
  if (!/^0x[a-fA-F0-9]{40}$/i.test(wallet)) return false;
  else return true;
}
