// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2";
import {EigenProtectedAVSHook} from "../src/EigenProtectedAVSHook.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Holesky addresses
        address strategyManager = 0xdfB5f6CE42aAA7830E94ECFCcAd411beF4D4D5b6;
        address delegationManager = 0xA44151489861Fe9e3055d95adC98FbD462B948e7;
        address brevisRequest = 0xce17b03d7901173cbfa017b1ae3a9b8632f42c18;
        address brevisProof = 0x728b3c4c8b88ad54b8118d4c6a65fac35e4cab6b;

        EigenProtectedAVSHook hook = new EigenProtectedAVSHook(
            strategyManager,
            delegationManager,
            brevisProof,
            brevisRequest
        );

        console2.log("Deployed to:", address(hook));
        vm.stopBroadcast();
    }
}