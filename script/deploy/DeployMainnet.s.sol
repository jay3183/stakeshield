// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script} from "forge-std/Script.sol";
import {EigenProtectedAVSHook} from "../../src/EigenProtectedAVSHook.sol";

contract DeployMainnet is Script {
    function run() public {
        vm.startBroadcast();

        EigenProtectedAVSHook hook = new EigenProtectedAVSHook(
            vm.envAddress("CONFIG_ADDRESS"),
            vm.envAddress("BREVIS_PROOF_ADDRESS"),
            vm.envAddress("BREVIS_REQUEST_ADDRESS"),
            vm.envAddress("DELEGATION_MANAGER_ADDRESS")
        );

        vm.stopBroadcast();
    }
} 