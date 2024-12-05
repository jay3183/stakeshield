// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {EigenProtectedAVSHook} from "../../src/EigenProtectedAVSHook.sol";
import {MockEigenLayer} from "../mocks/MockEigenLayer.sol";
import {MockBrevis} from "../mocks/MockBrevis.sol";
import {IPoolManager} from "lib/v4-core/src/interfaces/IPoolManager.sol";

contract BalanceInvariant is Test {
    EigenProtectedAVSHook hook;
    MockEigenLayer eigenLayer;
    MockBrevis brevis;
    address[] operators;
    uint256 totalStaked;

    function setUp() public {
        eigenLayer = new MockEigenLayer();
        brevis = new MockBrevis();
        hook = new EigenProtectedAVSHook(
            IPoolManager(makeAddr("poolManager")),
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

    function registerAndStake(uint256 amount) public {
        require(amount <= 100 ether, "Amount too large");
        address operator = makeAddr(string(abi.encodePacked("operator", operators.length)));
        operators.push(operator);
        
        vm.deal(operator, amount);
        vm.startPrank(operator);
        eigenLayer.setOperator(operator, true);
        hook.registerOperator();
        hook.setOperatorStake{value: amount}();
        vm.stopPrank();
        
        totalStaked += amount;
    }
} 