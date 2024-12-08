// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Test} from "forge-std/Test.sol";
import {EigenProtectedAVSHook} from "../src/EigenProtectedAVSHook.sol";
import {MockEigenLayer} from "./mocks/MockEigenLayer.sol";
import {SystemConfig} from "../src/config/SystemConfig.sol";

contract EigenProtectedAVSHookTest is Test {
    EigenProtectedAVSHook public hook;
    MockEigenLayer public mockEigenLayer;
    SystemConfig public config;

    address public operator = address(0x1);
    uint256 public constant MIN_STAKE = 0.1 ether;

    function setUp() public {
        // Deploy mocks
        mockEigenLayer = new MockEigenLayer();
        config = new SystemConfig(MIN_STAKE);
        
        // Deploy main contract
        hook = new EigenProtectedAVSHook(
            address(config),
            address(0x2), // mock brevis proof
            address(mockEigenLayer)
        );

        // Setup operator
        vm.deal(operator, 1 ether);
    }

    function testRegisterOperator() public {
        vm.startPrank(operator);
        hook.registerOperator();
        assertTrue(hook.operators(operator).isRegistered);
        vm.stopPrank();
    }

    function testSetStake() public {
        vm.startPrank(operator);
        hook.registerOperator();
        hook.setStake{value: MIN_STAKE}();
        assertEq(hook.operators(operator).stake, MIN_STAKE);
        vm.stopPrank();
    }

    function testFailSetStakeInsufficientAmount() public {
        vm.startPrank(operator);
        hook.registerOperator();
        vm.expectRevert("Insufficient stake");
        hook.setStake{value: MIN_STAKE - 0.01 ether}();
        vm.stopPrank();
    }
}