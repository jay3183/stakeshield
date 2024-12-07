// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Test} from "forge-std/Test.sol";
import {EigenProtectedAVSHook} from "../../src/EigenProtectedAVSHook.sol";
import {MockEigenLayer} from "../mocks/MockEigenLayer.sol";
import {MockBrevis} from "../mocks/MockBrevis.sol";
import {MockPoolManager} from "../mocks/MockPoolManager.sol";
import {IPoolManager} from "lib/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "lib/v4-core/src/types/PoolKey.sol";
import {IHooks} from "lib/v4-core/src/interfaces/IHooks.sol";
import {TestHelper} from "../helpers/TestHelper.sol";
import {BeforeSwapDelta} from "lib/v4-core/src/types/BeforeSwapDelta.sol";

contract UniswapIntegrationTest is TestHelper {
    EigenProtectedAVSHook hook;
    MockEigenLayer eigenLayer;
    MockBrevis brevis;
    MockPoolManager poolManager;
    address operator;

    function setUp() public {
        operator = makeAddr("operator");
        eigenLayer = new MockEigenLayer();
        brevis = new MockBrevis();
        poolManager = new MockPoolManager();
      

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

    function test_SwapIntegration() public {
        // Setup operator
        vm.startPrank(operator);
        hook.registerOperator();
        hook.setOperatorStake{value: 1 ether}();

        // Create test pool key
        PoolKey memory key = createPoolKey(
            makeAddr("token0"),
            makeAddr("token1"),
            3000,
            address(hook)
        );

        // Test swap params
        IPoolManager.SwapParams memory params = createSwapParams(
            true,
            1e18,
            0
        );

        // Verify hook behavior
        (bytes4 selector,,) = hook.beforeSwap(
            operator, 
            key, 
            params,
            "" // hookData
        );
        assertEq(selector, IHooks.beforeSwap.selector);

        // Test with fraud proof
        brevis.setProofValidity(operator, true);
        vm.expectRevert("Operator has fraud proof");
        hook.beforeSwap(
            operator, 
            key, 
            params,
            "" // hookData
        );

        vm.stopPrank();
    }

    function test_beforeSwap() public {
        // Create test pool key
        PoolKey memory key = createPoolKey(
            makeAddr("token0"),
            makeAddr("token1"),
            3000,
            address(hook)
        );

        // Test swap params
        IPoolManager.SwapParams memory params = createSwapParams(
            true,
            1e18,
            0
        );

        (bytes4 selector,,) = hook.beforeSwap(
            operator, 
            key, 
            params,
            "" // hookData
        );
        assertEq(selector, IHooks.beforeSwap.selector);
    }
} 