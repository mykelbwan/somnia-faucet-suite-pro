import { v4 as uuidv4 } from "uuid"; // Recommended: install uuid (npm i uuid @types/uuid)
import { db } from "../db/lowdb.init.";
import { QueueItem } from "../interface/faucet.interface";
import { claimNative } from "./claimSomnia.service";
import { parseEther } from "ethers";
import { claimERC20Token } from "./claimErc20Faucet.service";
import { registerClaim } from "./faucetRateLimiter.service";

// Mutex lock to prevent double spending
let isProcessing = false;

// adds a req to the db and triggers the worker
export async function addToQueue(
  wallet: string,
  username: string,
  tokenSymbol: string,
  amount: string,
  type: "native" | "erc20",
  tokenAddress?: string,
) {
  await db.read();

  const newItem: QueueItem = {
    id: uuidv4(),
    wallet,
    username,
    tokenSymbol,
    tokenAddress,
    amount,
    type,
    timestamp: Date.now(),
    status: "pending",
  };

  db.data.queue.push(newItem);
  await db.write();

  // Trigger worker immediately
  processQueue();

  return newItem.id;
}

// Processes items one by one FIFO (first in, first out)
export async function processQueue() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    await db.read();

    while (db.data.queue.length > 0) {
      // Peak at the first item
      const item = db.data.queue[0];
      console.log(
        `[Queue] Processing ${item?.type} claim for ${item?.wallet}...`,
      );

      try {
        let txHash = "";

        if (item?.type === "native") {
          txHash = await claimNative(item.wallet, parseEther(item.amount));
        } else if (item?.type === "erc20") {
          if (!item.tokenAddress) {
            throw new Error(
              `Token address missing for ERC20 claim: ${item.id}`,
            );
          }

          txHash = await claimERC20Token(
            item?.wallet!,
            item.tokenAddress,
            parseEther(item.amount),
          );
        }

        // Only register in DB if the transaction was successful
        await registerClaim(
          item?.wallet!,
          item?.username!,
          item?.tokenSymbol!,
          Number(item?.amount),
        );

        console.log(`[Queue] Success! Hash: ${txHash}`);
        console.log(
          `${item?.amount} ${item?.tokenSymbol} to ${item?.username} (${item?.wallet})`,
        );
      } catch (err: any) {
        console.error(`[Queue] Failed for ${item?.wallet}:`, err.message);
        console.error(`❌ FAILED: ${item?.username} - ${err.message}`);
      } finally {
        // ALWAYS remove the item from the queue regardless of success/fail
        // to prevent getting stuck in an infinite loop on a bad request.
        await db.read();
        db.data.queue.shift();
        await db.write();
      }
    }
  } catch (err: any) {
    console.error("[Queue] Critical worker error:", err);
  } finally {
    isProcessing = false;
  }
}
