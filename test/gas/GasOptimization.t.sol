// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {EigenProtectedAVSHook} from "../../src/EigenProtectedAVSHook.sol";
import {MockPoolManager} from "../mocks/MockPoolManager.sol";
import {MockEigenLayer} from "../mocks/MockEigenLayer.sol";
import {MockBrevis} from "../mocks/MockBrevis.sol";
import {TestHelper} from "../helpers/TestHelper.sol";
import {IPoolManager} from "lib/v4-core/src/interfaces/IPoolManager.sol";
import {BeforeSwapDelta} from "lib/v4-core/src/types/BeforeSwapDelta.sol";


contract GasOptimizationTest is TestHelper {
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

    function testGas_RegisterOperator() public {
        vm.startPrank(operator);
        uint256 gasBefore = gasleft();
        hook.registerOperator();
        uint256 gasUsed = gasBefore - gasleft();
        assertLt(gasUsed, 100000, "Gas usage too high for registration");
        vm.stopPrank();
    }

    function testGas_SetStake() public {
        vm.startPrank(operator);
        hook.registerOperator();
        uint256 gasBefore = gasleft();
        hook.setOperatorStake{value: 1 ether}();
        uint256 gasUsed = gasBefore - gasleft();
        assertLt(gasUsed, 100000, "Gas usage too high for staking");
        vm.stopPrank();
    }

    function testGas_WithdrawStake() public {
        vm.startPrank(operator);
        hook.registerOperator();
        hook.setOperatorStake{value: 1 ether}();
        uint256 gasBefore = gasleft();
        hook.withdrawStake();
        uint256 gasUsed = gasBefore - gasleft();
        assertLt(gasUsed, 100000, "Gas usage too high for withdrawal");
        vm.stopPrank();
    }

    function testGas_SlashOperator() public {
        vm.startPrank(operator);
        hook.registerOperator();
        hook.setOperatorStake{value: 1 ether}();
        vm.stopPrank();

        uint256 gasBefore = gasleft();
        vm.prank(address(this));
        hook.slashOperator(operator);
        uint256 gasUsed = gasBefore - gasleft();
        assertLt(gasUsed, 100000, "Gas usage too high for slashing");
    }

    function testGas_BeforeSwap() public {
        uint256 gasBefore = gasleft();
        hook.beforeSwap(
            address(this),
            createPoolKey(makeAddr("token0"), makeAddr("token1"), 3000, address(hook)),
            createSwapParams(true, 1e18, 0),
            ""
        );
        uint256 gasUsed = gasBefore - gasleft();
        assertLt(gasUsed, 100000, "Gas usage too high for beforeSwap");
    }
} 