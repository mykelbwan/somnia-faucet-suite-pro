import "dotenv/config";
import { ethers } from "ethers";
import { abi } from "../utils/abi";

const { RPC_PROVIDER, PRIVATE_KEY, SMART_CONTRACT } = process.env;

if (!RPC_PROVIDER) throw new Error("Invalid RPC url env");
if (!PRIVATE_KEY) throw new Error("Invalid admin private key env");
if (!SMART_CONTRACT) throw new Error("Invalid smart contract address");

const provider = new ethers.JsonRpcProvider(RPC_PROVIDER);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
export const faucetContract = new ethers.Contract(SMART_CONTRACT, abi, wallet);
