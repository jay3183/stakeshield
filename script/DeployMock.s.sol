// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Script} from "forge-std/Script.sol";
import {MockBrevis} from "../src/MockBrevis.sol";
import {console} from "forge-std/console.sol";

contract DeployMock is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        MockBrevis mockBrevis = new MockBrevis();
        
        console.log("MockBrevis deployed at:", address(mockBrevis));
        
        vm.stopBroadcast();
    }
} 