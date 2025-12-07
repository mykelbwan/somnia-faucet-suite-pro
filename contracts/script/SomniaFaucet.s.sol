// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import {Script} from "forge-std/Script.sol";
import {SomniaFaucet} from "../src/SomniaFaucet.sol";

contract SomniaFaucetScript is Script {
    SomniaFaucet public faucet;

    function run() public {
        vm.startBroadcast();
        faucet = new SomniaFaucet();
        vm.stopBroadcast();
    }
}
