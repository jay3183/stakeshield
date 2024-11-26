// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {EigenProtectedAVSHook} from "../src/EigenProtectedAVSHook.sol";
import {IPoolManager} from "lib/v4-core/src/interfaces/IPoolManager.sol";

contract DeployEigenProtectedAVSHook is Script {
    function run() public {
        vm.startBroadcast();
        
        // Deploy or get the PoolManager address first
        address poolManagerAddress = address(0); // Replace with actual address
        
        // Deploy the hook
        new EigenProtectedAVSHook(IPoolManager(poolManagerAddress));
        
        vm.stopBroadcast();
    }
}