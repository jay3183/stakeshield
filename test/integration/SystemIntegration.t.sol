// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Test} from "forge-std/Test.sol";
import {EigenProtectedAVSHook} from "../../src/EigenProtectedAVSHook.sol";
import {SystemConfig} from "../../src/config/SystemConfig.sol";
import {MockBrevis} from "../mocks/MockBrevis.sol";
import {MockEigenLayer} from "../mocks/MockEigenLayer.sol";
import {Errors} from "../../src/libraries/Errors.sol";

contract SystemIntegrationTest is Test {
    EigenProtectedAVSHook hook;
    SystemConfig config;
    MockBrevis brevis;
    MockEigenLayer eigenLayer;
    
    address operator = address(0x1);
    address treasury = address(0x2);
    
    event OperatorRegistered(address indexed operator, uint256 stake);
    event StakeUpdated(address indexed operator, uint256 newStake);
    event FraudProofVerified(address indexed operator, bytes32 indexed proofId, bool isValid, string error);

    function setUp() public {
        // Deploy all contracts
        config = new SystemConfig(
            1 ether,     // minStake
            100 ether,   // maxStake
            50,          // fraudPenalty
            3,           // maxFraudCount
            7 days,      // unstakeDelay
            100         // maxPriceImpact
        );
        
        brevis = new MockBrevis();
        eigenLayer = new MockEigenLayer();
        
        hook = new EigenProtectedAVSHook(
            address(config),
            address(brevis),
            address(brevis),
            address(eigenLayer)
        );

        // Setup initial state
        vm.deal(operator, 100 ether);
    }

    function testFullOperatorLifecycle() public {
        // 1. Register with EigenLayer first
        vm.startPrank(operator);
        eigenLayer.registerAsOperator();
        eigenLayer.depositAsOperator{value: 10 ether}();

        // 2. Register with AVS Hook
        vm.expectEmit(true, false, false, true);
        emit OperatorRegistered(operator, 0);
        hook.registerOperator();

        // 3. Set stake
        vm.expectEmit(true, false, false, true);
        emit StakeUpdated(operator, 5 ether);
        hook.setOperatorStake{value: 5 ether}();

        // 4. Submit valid proof
        brevis.setProofValidity(true);
        bytes32 proofId = keccak256("valid-proof");
        bytes memory proofData = "valid-data";

        vm.expectEmit(true, true, false, true);
        emit FraudProofVerified(operator, proofId, true, "");
        bool result = hook.verifyFraudProof(operator, proofId, proofData);
        assertTrue(result);

        // 5. Submit invalid proof
        brevis.setProofValidity(false);
        proofId = keccak256("invalid-proof");
        proofData = "invalid-data";

        vm.expectEmit(true, true, false, true);
        emit FraudProofVerified(operator, proofId, false, "Invalid proof");
        result = hook.verifyFraudProof(operator, proofId, proofData);
        assertFalse(result);

        vm.stopPrank();
    }

    function testSystemConfigIntegration() public {
        // Test config parameter changes affect hook behavior
        vm.startPrank(operator);
        eigenLayer.registerAsOperator();
        hook.registerOperator();

        // Should fail due to min stake
        vm.expectRevert(Errors.InsufficientStake.selector);
        hook.setOperatorStake{value: 0.5 ether}();

        // Should fail due to max stake
        vm.expectRevert(Errors.ExcessiveStake.selector);
        hook.setOperatorStake{value: 101 ether}();

        vm.stopPrank();
    }
} 