// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {EigenProtectedAVSHook} from "../src/EigenProtectedAVSHook.sol";
import {SystemConfig} from "../src/config/SystemConfig.sol";
import {console2} from "forge-std/console2.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy config first
        SystemConfig config = new SystemConfig(
            1 ether,     // minStake
            100 ether,   // maxStake
            50,          // fraudPenalty (50%)
            3,           // maxFraudCount
            7 days,      // unstakeDelay
            100         // maxPriceImpact (1%)
        );

        // Get dependency addresses from environment
        address brevisProof = vm.envAddress("BREVIS_PROOF_ADDRESS");
        address brevisRequest = vm.envAddress("BREVIS_REQUEST_ADDRESS");
        address delegationManager = vm.envAddress("DELEGATION_MANAGER_ADDRESS");

        // Deploy main contract
        EigenProtectedAVSHook hook = new EigenProtectedAVSHook(
            address(config),
            brevisProof,
            brevisRequest,
            delegationManager
        );

        console2.log("Deployment Summary");
        console2.log("-----------------");
        console2.log("Config:", address(config));
        console2.log("Hook:", address(hook));
        console2.log("Network:", block.chainid);

        vm.stopBroadcast();
    }
}