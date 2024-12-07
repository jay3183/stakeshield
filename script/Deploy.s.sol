// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {EigenProtectedAVSHook} from "../src/EigenProtectedAVSHook.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Holesky addresses
        address strategyManager = 0xdfB5f6CE42aAA7830E94ECFCcAd411beF4d4D5b6;
        address delegationManager = 0xA44151489861Fe9e3055d95adC98FbD462B948e7;
        address brevisRequest = 0xCE17B03d7901173Cbfa017B1ae3A9b8632f42c18;
        address brevisProof = 0x728b3C4C8b88AD54B8118D4c6a65fAC35e4CAb6B;

        EigenProtectedAVSHook hook = new EigenProtectedAVSHook(
            strategyManager,
            delegationManager,
            brevisProof,
            brevisRequest
        );

        console.log("Deployed to:", address(hook));
        vm.stopBroadcast();
    }
}