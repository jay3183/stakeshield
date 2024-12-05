// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {EigenProtectedAVSHook} from "../../src/EigenProtectedAVSHook.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address brevisProof = vm.envAddress("BREVIS_PROOF_ADDRESS");
        address brevisRequest = vm.envAddress("BREVIS_REQUEST_ADDRESS");

        EigenProtectedAVSHook hook = new EigenProtectedAVSHook(
            brevisProof,
            brevisRequest
        );

        vm.stopBroadcast();
    }
} 