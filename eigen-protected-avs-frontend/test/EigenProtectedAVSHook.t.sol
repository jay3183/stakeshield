// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Test} from "forge-std/Test.sol";
import {EigenProtectedAVSHook} from "../contracts/src/EigenProtectedAVSHook.sol";
import {SystemConfig} from "../contracts/src/config/SystemConfig.sol";
import {IBrevisProof} from "../contracts/src/interfaces/IBrevisProof.sol";
import {IDelegationManager} from "../contracts/src/interfaces/IDelegationManager.sol";
import {PoolKey} from "../lib/v4-core/src/types/PoolKey.sol";
import {IPoolManager} from "../lib/v4-core/src/interfaces/IPoolManager.sol";

contract MockBrevisProof is IBrevisProof {
    bool private shouldDetectFraud;

    function setShouldDetectFraud(bool _shouldDetectFraud) external {
        shouldDetectFraud = _shouldDetectFraud;
    }

    function verifyFraudProof(bytes32, bytes calldata) external pure returns (bool, string memory) {
        return (false, "");
    }

    function detectAnomalies(address, bytes calldata) external view returns (bool) {
        return shouldDetectFraud;
    }
}

contract EigenProtectedAVSHookTest is Test {
    EigenProtectedAVSHook public hook;
    SystemConfig public config;
    MockBrevisProof public brevisProof;
    
    address public operator = address(0x1);
    address public owner = address(0x2);
    uint256 public constant MIN_STAKE = 1 ether;
    uint256 public constant MAX_FRAUD_COUNT = 3;

    event OperatorRegistered(address indexed operator, uint256 stake);
    event StakeUpdated(address indexed operator, uint256 stake);
    event OperatorActionProcessed(address indexed operator, bytes customData);
    event FraudDetected(address indexed operator, bytes data);

    function setUp() public {
        vm.startPrank(owner);
        
        // Deploy contracts
        config = new SystemConfig(
            MIN_STAKE,      // minStake
            10 ether,       // maxStake
            MAX_FRAUD_COUNT,// maxFraudCount
            0.1 ether      // fraudPenalty
        );
        brevisProof = new MockBrevisProof();
        hook = new EigenProtectedAVSHook(
            address(config),
            address(brevisProof),
            address(0x3) // mock delegation manager
        );
        
        vm.stopPrank();

        // Fund operator
        vm.deal(operator, 10 ether);
    }

    function testRegisterOperator() public {
        vm.startPrank(operator);
        
        vm.expectEmit(true, false, false, true);
        emit OperatorRegistered(operator, 0);
        
        hook.registerOperator();
        vm.stopPrank();
    }

    function testCannotRegisterTwice() public {
        vm.startPrank(operator);
        hook.registerOperator();
        
        vm.expectRevert("Operator already registered");
        hook.registerOperator();
        vm.stopPrank();
    }

    function testSetStake() public {
        vm.startPrank(operator);
        hook.registerOperator();
        
        vm.expectEmit(true, false, false, true);
        emit StakeUpdated(operator, MIN_STAKE);
        
        hook.setStake{value: MIN_STAKE}();
        vm.stopPrank();
    }

    function testCannotSetStakeBelowMinimum() public {
        vm.startPrank(operator);
        hook.registerOperator();
        
        vm.expectRevert("Insufficient stake");
        hook.setStake{value: MIN_STAKE - 0.1 ether}();
        vm.stopPrank();
    }

    function testProcessOperatorAction() public {
        bytes memory customData = "test data";
        
        vm.startPrank(operator);
        hook.registerOperator();
        
        vm.expectEmit(true, false, false, true);
        emit OperatorActionProcessed(operator, customData);
        
        hook.processOperatorAction(operator, customData);
        vm.stopPrank();
    }

    function testFraudDetection() public {
        bytes memory customData = "fraudulent data";
        
        vm.startPrank(operator);
        hook.registerOperator();
        
        // Set brevis to detect fraud
        brevisProof.setShouldDetectFraud(true);
        
        vm.expectEmit(true, false, false, true);
        emit FraudDetected(operator, customData);
        
        vm.expectRevert("Fraud detected");
        hook.processOperatorAction(operator, customData);
        vm.stopPrank();
    }

    function testPauseUnpause() public {
        vm.startPrank(owner);
        hook.pause();
        
        // Try to register when paused
        vm.startPrank(operator);
        bool failed;
        try hook.registerOperator() {
            failed = false;
        } catch {
            failed = true;
        }
        assertTrue(failed, "Should fail when paused");
        vm.stopPrank();
        
        // Unpause and try again
        vm.startPrank(owner);
        hook.unpause();
        
        vm.startPrank(operator);
        hook.registerOperator(); // Should work now
        vm.stopPrank();
    }

    function testRemoveOperator() public {
        vm.startPrank(operator);
        hook.registerOperator();
        vm.stopPrank();
        
        vm.startPrank(owner);
        hook.removeOperator(operator);
        vm.stopPrank();
        
        vm.startPrank(operator);
        vm.expectRevert("Not a registered operator");
        hook.setStake{value: MIN_STAKE}();
        vm.stopPrank();
    }
}