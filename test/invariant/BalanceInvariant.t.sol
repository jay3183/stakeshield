// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {EigenProtectedAVSHook} from "../../src/EigenProtectedAVSHook.sol";
import {MockPoolManager} from "../mocks/MockPoolManager.sol";
import {MockEigenLayer} from "../mocks/MockEigenLayer.sol";
import {MockBrevis} from "../mocks/MockBrevis.sol";
import {IPoolManager} from "lib/v4-core/src/interfaces/IPoolManager.sol";

contract BalanceInvariant is Test {
    EigenProtectedAVSHook hook;
    MockEigenLayer eigenLayer;
    MockBrevis brevis;
    MockPoolManager poolManager;
    address[] operators;
    uint256 totalStaked;
    uint256 totalFraudCount;

    function setUp() public {
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
    }

    function invariant_totalBalance() external view {
        assertEq(address(hook).balance, totalStaked);
    }

    function invariant_operatorStakes() external view {
        uint256 sumOfStakes;
        for (uint256 i = 0; i < operators.length; i++) {
            (uint128 stake, , ) = hook.operators(operators[i]);
            sumOfStakes += stake;
        }
        assertEq(sumOfStakes, totalStaked);
    }

    function invariant_fraudCount() external view {
        uint256 sumOfFraudCounts;
        for (uint256 i = 0; i < operators.length; i++) {
            (, uint128 fraudCount, ) = hook.operators(operators[i]);
            sumOfFraudCounts += fraudCount;
        }
        assertEq(sumOfFraudCounts, totalFraudCount);
    }

    function invariant_registrationStatus() external view {
        for (uint256 i = 0; i < operators.length; i++) {
            (, , bool isRegistered) = hook.operators(operators[i]);
            if (!isRegistered) {
                (uint128 stake, , ) = hook.operators(operators[i]);
                assertEq(stake, 0, "Unregistered operator has non-zero stake");
            }
        }
    }

    function invariant_callSummary() public view {
        console.log("Total operators:", operators.length);
        console.log("Total staked:", totalStaked);
        console.log("Total fraud count:", totalFraudCount);
    }
} 