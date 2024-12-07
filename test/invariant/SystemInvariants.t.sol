// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Test} from "forge-std/Test.sol";
import {EigenProtectedAVSHook} from "../../src/EigenProtectedAVSHook.sol";
import {SystemConfig} from "../../src/config/SystemConfig.sol";
import {MockBrevis} from "../mocks/MockBrevis.sol";
import {MockEigenLayer} from "../mocks/MockEigenLayer.sol";

contract SystemInvariantsTest is Test {
    EigenProtectedAVSHook hook;
    SystemConfig config;
    MockBrevis brevis;
    MockEigenLayer eigenLayer;
    
    uint256 totalStaked;
    address[] operators;

    function setUp() public {
        config = new SystemConfig(
            1 ether,     // minStake
            100 ether,   // maxStake
            50,          // fraudPenalty
            3,          // maxFraudCount
            7 days,     // unstakeDelay
            100        // maxPriceImpact
        );
        
        brevis = new MockBrevis();
        eigenLayer = new MockEigenLayer();
        
        hook = new EigenProtectedAVSHook(
            address(config),
            address(brevis),
            address(brevis),
            address(eigenLayer)
        );
    }

    function invariant_totalStakeNeverExceedsMax() public {
        assertTrue(address(hook).balance <= config.maxStake() * operators.length);
    }

    function invariant_operatorStakeWithinBounds() public {
        for (uint256 i = 0; i < operators.length; i++) {
            (uint128 stake,,) = hook.operators(operators[i]);
            assertTrue(stake >= config.minStake() || stake == 0);
            assertTrue(stake <= config.maxStake());
        }
    }

    function invariant_slashingNeverExceedsStake() public {
        for (uint256 i = 0; i < operators.length; i++) {
            (uint128 stake,,) = hook.operators(operators[i]);
            assertTrue(stake <= eigenLayer.getStake(operators[i]));
        }
    }
} 