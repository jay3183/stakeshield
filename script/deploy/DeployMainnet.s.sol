// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {EigenProtectedAVSHook} from "../../src/EigenProtectedAVSHook.sol";
import {IPoolManager} from "lib/v4-core/src/interfaces/IPoolManager.sol";

contract DeployMainnet is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address poolManager = vm.envAddress("POOL_MANAGER");
        address eigenLayer = vm.envAddress("EIGEN_LAYER");
        address brevis = vm.envAddress("BREVIS");
        address brevisProof = vm.envAddress("BREVIS_PROOF");
        address brevisRequest = vm.envAddress("BREVIS_REQUEST");
        address delegationManager = vm.envAddress("DELEGATION_MANAGER");

        vm.startBroadcast(deployerPrivateKey);

        EigenProtectedAVSHook hook = new EigenProtectedAVSHook(
            IPoolManager(poolManager),
            brevis,
            eigenLayer,
            brevisProof,
            brevisRequest,
            delegationManager
        );

        console.log("Deployed to:", address(hook));
        vm.stopBroadcast();
    }
} 