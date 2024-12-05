// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/EigenProtectedAVSHook.sol";

contract DeployEigenProtectedAVSHook is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        EigenProtectedAVSHook hook = new EigenProtectedAVSHook(
            vm.envAddress("CONFIG_ADDRESS"),
            vm.envAddress("BREVIS_ADDRESS"), 
            vm.envAddress("BREVIS_REQUEST_ADDRESS"),
            vm.envAddress("EIGEN_LAYER_ADDRESS")
        );

        console.log("Deployed to:", address(hook));

        vm.stopBroadcast();
    }
}