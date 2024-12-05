// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {EigenProtectedAVSHook} from "../src/EigenProtectedAVSHook.sol";

contract TestDeployment is Script {
    address constant DEPLOYED_CONTRACT = address(0);

    function run() public {
        // Used for test deployment configuration
        // DEPLOYED_CONTRACT;
    }
}