// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Test} from "forge-std/Test.sol";
import {EigenProtectedAVSHook} from "../../src/EigenProtectedAVSHook.sol";

contract GasOptimizationTest is Test {
    EigenProtectedAVSHook hook;

    function setUp() public {
        hook = new EigenProtectedAVSHook(
            makeAddr("config"),
            makeAddr("brevisProof"),
            makeAddr("brevisRequest"),
            makeAddr("delegationManager")
        );
    }

    // Remove or update withdrawStake test as this function doesn't exist
    // function testWithdrawStake() public {
    //     hook.withdrawStake();
    // }
} 