// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script, console2} from "forge-std/Script.sol";
import {EigenProtectedAVSHook} from "../../src/EigenProtectedAVSHook.sol";
import {MockPoolManager} from "../../test/mocks/MockPoolManager.sol";
import {MockEigenLayer} from "../../test/mocks/MockEigenLayer.sol";
import {MockBrevis} from "../../test/mocks/MockBrevis.sol";
import {IPoolManager} from "lib/v4-core/src/interfaces/IPoolManager.sol";

contract DeployTest is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy mocks
        MockPoolManager poolManager = new MockPoolManager();
        MockEigenLayer eigenLayer = new MockEigenLayer();
        MockBrevis brevis = new MockBrevis();

        // Deploy hook with 4 arguments instead of 6
        EigenProtectedAVSHook hook = new EigenProtectedAVSHook(
            address(poolManager),      // config address
            address(brevis),          // brevis proof address
            address(brevis),          // brevis request address
            address(eigenLayer)       // delegation manager address
        );

        console2.log("Contracts deployed:");
        console2.log("PoolManager:", address(poolManager));
        console2.log("EigenLayer:", address(eigenLayer));
        console2.log("Brevis:", address(brevis));
        console2.log("Hook:", address(hook));

        vm.stopBroadcast();
    }
} 