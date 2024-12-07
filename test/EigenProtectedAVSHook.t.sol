// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Test} from "forge-std/Test.sol";
import {EigenProtectedAVSHook, OperatorData} from "../src/EigenProtectedAVSHook.sol";
import {SystemConfig} from "../src/config/SystemConfig.sol";
import {MockBrevis} from "./mocks/MockBrevis.sol";
import {MockEigenLayer} from "./mocks/MockEigenLayer.sol";
import {Errors} from "../src/libraries/Errors.sol";

contract EigenProtectedAVSHookTest is Test {
    EigenProtectedAVSHook hook;
    SystemConfig config;
    MockBrevis brevis;
    MockEigenLayer eigenLayer;
    
    address operator = address(0x1);
    uint256 constant STAKE_AMOUNT = 1 ether;

    function setUp() public {
        // Deploy dependencies
        config = new SystemConfig(
            1 ether,     // minStake
            100 ether,   // maxStake
            50,          // fraudPenalty (50%)
            3,           // maxFraudCount
            7 days,      // unstakeDelay
            100         // maxPriceImpact (1%)
        );
        
        brevis = new MockBrevis();
        eigenLayer = new MockEigenLayer();
        
        // Deploy main contract
        hook = new EigenProtectedAVSHook(
            address(config),
            address(brevis),
            address(brevis), // Using MockBrevis for both interfaces
            address(eigenLayer)
        );

        // Setup operator
        vm.deal(operator, 10 ether);
        eigenLayer.setOperator(operator, true);
    }

    function testRegisterOperator() public {
        vm.startPrank(operator);
        hook.registerOperator();
        
        OperatorData memory data = hook.operators(operator);
        uint128 stake = data.stake;
        uint128 fraudCount = data.fraudCount;
        bool isRegistered = data.isRegistered;
        assertEq(stake, 0);
        assertEq(fraudCount, 0);
        assertTrue(isRegistered);
        vm.stopPrank();
    }

    function testSetOperatorStake() public {
        // Register operator first
        vm.startPrank(operator);
        hook.registerOperator();
        
        // Set stake
        hook.setOperatorStake{value: 1 ether}();
        
        OperatorData memory data = hook.operators(operator);
        uint128 stake = data.stake;
        assertEq(stake, 1 ether);
        vm.stopPrank();
    }

    function testFraudProofVerification() public {
        // Setup
        vm.startPrank(operator);
        hook.registerOperator();
        hook.setOperatorStake{value: 1 ether}();
        vm.stopPrank();

        // Mock fraud proof verification
        brevis.setProofValidity(true);
        bytes32 proofId = keccak256("test-proof");
        bytes memory proofData = "test-data";

        bool result = hook.verifyFraudProof(operator, proofId, proofData);
        assertTrue(result);
        
        // Verify operator state
        OperatorData memory data = hook.operators(operator);
        uint128 stake = data.stake;
        uint128 fraudCount = data.fraudCount;
        bool isRegistered = data.isRegistered;
        assertEq(stake, 1 ether);
        assertEq(fraudCount, 0);
        assertTrue(isRegistered);
    }

    function testSlashingAfterMaxFraudCount() public {
        // Setup
        vm.startPrank(operator);
        hook.registerOperator();
        hook.setOperatorStake{value: 1 ether}();
        vm.stopPrank();

        // Mock invalid proofs
        brevis.setProofValidity(false);
        bytes32 proofId = keccak256("test-proof");
        bytes memory proofData = "test-data";

        // Submit max fraud proofs
        for (uint256 i = 0; i < config.maxFraudCount(); i++) {
            hook.verifyFraudProof(operator, proofId, proofData);
        }

        // Verify operator is slashed
        OperatorData memory data = hook.operators(operator);
        uint128 stake = data.stake;
        assertEq(stake, 0.5 ether); // 50% penalty
    }

    function testRevertWhenUnauthorized() public {
        address unauthorized = address(0x2);
        vm.startPrank(unauthorized);
        
        vm.expectRevert(Errors.UnauthorizedOperator.selector);
        hook.registerOperator();
        
        vm.stopPrank();
    }

    // Add more tests...
}
