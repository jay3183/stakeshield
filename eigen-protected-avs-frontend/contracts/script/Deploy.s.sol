// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script, console2} from "forge-std/Script.sol";
import {EigenProtectedAVSHook} from "../src/EigenProtectedAVSHook.sol";
import {SystemConfig} from "../src/config/SystemConfig.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy SystemConfig
        SystemConfig config = new SystemConfig(
            1 ether,    // minStake
            10 ether,   // maxStake
            3,          // maxFraudCount
            0.1 ether   // fraudPenalty
        );
        console2.log("SystemConfig deployed to:", address(config));  // Changed from console.log to console2.log

        // Deploy EigenProtectedAVSHook
        EigenProtectedAVSHook hook = new EigenProtectedAVSHook(
            address(config),
            vm.envAddress("BREVIS_PROOF_ADDRESS"),     // Holesky Brevis Proof
            vm.envAddress("DELEGATION_MANAGER_ADDRESS") // Holesky Delegation Manager
        );
        console2.log("EigenProtectedAVSHook deployed to:", address(hook));  // Changed from console.log to console2.log

        vm.stopBroadcast();
    }
}