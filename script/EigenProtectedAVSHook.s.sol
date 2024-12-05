// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/EigenProtectedAVSHook.sol";

contract DeployEigenProtectedAVSHook is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address brevisAddress = vm.envAddress("BREVIS_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        EigenProtectedAVSHook hook = new EigenProtectedAVSHook(brevisAddress);

        vm.stopBroadcast();
    }
}