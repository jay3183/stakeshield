// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {EigenProtectedAVSHook} from "../src/EigenProtectedAVSHook.sol";
import {MockPoolManager} from "../test/mocks/MockPoolManager.sol";
import {MockEigenLayer} from "../test/mocks/MockEigenLayer.sol";
import {MockBrevis} from "../test/mocks/MockBrevis.sol";
import {IPoolManager} from "lib/v4-core/src/interfaces/IPoolManager.sol";

contract LocalDeployScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy mock contracts
        MockPoolManager poolManager = new MockPoolManager();
        MockEigenLayer eigenLayer = new MockEigenLayer();
        MockBrevis brevis = new MockBrevis();

        // Deploy hook
        EigenProtectedAVSHook hook = new EigenProtectedAVSHook(
            IPoolManager(address(poolManager)),
            address(brevis),
            address(eigenLayer),
            address(brevis),
            address(brevis),
            address(eigenLayer)
        );

        console2.log("Local Deployment Details:");
        console2.log("------------------------");
        console2.log("Hook:", address(hook));
        console2.log("Pool Manager:", address(poolManager));
        console2.log("EigenLayer:", address(eigenLayer));
        console2.log("Brevis:", address(brevis));

        vm.stopBroadcast();
    }
} 