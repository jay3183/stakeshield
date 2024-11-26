// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {EigenProtectedAVSHook} from "../src/EigenProtectedAVSHook.sol";
import {IPoolManager} from "lib/v4-core/src/interfaces/IPoolManager.sol";

contract DeployEigenProtectedAVSHook is Script {
    function run() external {
        // Begin recording transactions for deployment
        vm.startBroadcast();

        // Deploy the hook with constructor arguments
        // Note: You'll need to replace these addresses with actual values
        address poolManager = address(0); // Replace with actual PoolManager address
        address priceFeed = address(0);   // Replace with actual Chainlink price feed
        address eigenLayer = address(0);   // Replace with actual EigenLayer address

        EigenProtectedAVSHook hook = new EigenProtectedAVSHook(
            IPoolManager(poolManager),
            priceFeed,
            eigenLayer
        );

        vm.stopBroadcast();
    }
}