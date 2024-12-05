// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {Networks} from "./config/Networks.s.sol";

contract Verify is Script, Networks {
    function run() public {
        uint256 chainId = block.chainid;
        address contractAddress = vm.envAddress("DEPLOYED_ADDRESS");

        string memory cmd = string.concat(
            "forge verify-contract ",
            vm.toString(contractAddress),
            " EigenProtectedAVSHook --chain ",
            vm.toString(chainId)
        );
        vm.writeLine("verification.txt", cmd);
    }
} 