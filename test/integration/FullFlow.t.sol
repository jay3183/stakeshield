// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {EigenProtectedAVSHook} from "../../src/EigenProtectedAVSHook.sol";
import {MockEigenLayer} from "../mocks/MockEigenLayer.sol";
import {MockBrevis} from "../mocks/MockBrevis.sol";
import {MockPoolManager} from "../mocks/MockPoolManager.sol";
import {IPoolManager} from "lib/v4-core/src/interfaces/IPoolManager.sol";
import {TestHelper} from "../helpers/TestHelper.sol";

contract FullFlowTest is TestHelper {
    EigenProtectedAVSHook hook;
    MockEigenLayer eigenLayer;
    MockBrevis brevis;
    MockPoolManager poolManager;
    address operator;

    function setUp() public {
        operator = makeAddr("operator");
        eigenLayer = new MockEigenLayer();
        brevis = new MockBrevis();


        hook = new EigenProtectedAVSHook(
            IPoolManager(address(poolManager)),
            address(brevis),
            address(eigenLayer),
            address(brevis),
            address(brevis),
            address(eigenLayer)
        );

        vm.deal(operator, 100 ether);
        eigenLayer.setOperator(operator, true);
    }

    function testFullOperatorFlow() public {
        vm.startPrank(operator);
        
        // Register operator
        hook.registerOperator();
        
        // Set stake
        hook.setOperatorStake{value: 1 ether}();
        
        // Verify operator status
        (uint128 stake, uint128 fraudCount, bool isRegistered) = hook.operators(operator);
        assertEq(stake, 1 ether);
        assertEq(fraudCount, 0);
        assertTrue(isRegistered);

        vm.stopPrank();
    }
} 