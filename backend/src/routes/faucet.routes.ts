import { Router } from "express";

import { globalFaucetLimiter } from "../middleware/limiter";
import { adminAuth } from "../middleware/adminAuth";
import { acknowledgeAlerts } from "../controller/clearStatisticsAllerts.controller";
import { claimSomnia } from "../controller/clainSomniaFaucet.controller";
import { claimERC20 } from "../controller/claimERC20Faucet.controller";
import { getClaimStatus } from "../controller/faucetCooldownStatus.controller";
import { getFaucetStats } from "../controller/faucetStatistics.controller";
import { getFaucetBal } from "../controller/faucetBalance.controller";
import { getQueueStats } from "../services/queueStats.service";

const router: Router = Router();

router.post("/admin/alerts/acknowledge", adminAuth, acknowledgeAlerts);
router.get("/claim-stt", globalFaucetLimiter, claimSomnia);
router.get("/claim-erc20", globalFaucetLimiter, claimERC20);
router.get("/claim-status", getClaimStatus);
router.get("/admin/faucet-stats", adminAuth, getFaucetStats);
router.get("/admin/faucet-balances", adminAuth, getFaucetBal);
router.get("/admin/queue-stats", adminAuth, getQueueStats);

export default router;
