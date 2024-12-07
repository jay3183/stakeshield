// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {IEigenProtectedAVSHook} from "./interfaces/IEigenProtectedAVSHook.sol";
import {SystemConfig} from "./config/SystemConfig.sol";
import {Errors} from "./libraries/Errors.sol";
import {ProofVerification} from "./libraries/ProofVerification.sol";
import {PriceImpact} from "./libraries/PriceImpact.sol";
import {IBrevisProof} from "./interfaces/IBrevisProof.sol";
import {IBrevisRequest} from "./interfaces/IBrevisRequest.sol";
import {IDelegationManager} from "./interfaces/IDelegationManager.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {OperatorData} from "./interfaces/IEigenProtectedAVSHook.sol";

contract EigenProtectedAVSHook is IEigenProtectedAVSHook, ReentrancyGuard, Pausable, Ownable {
    using ProofVerification for IBrevisProof;

    // State variables
    SystemConfig public immutable config;
    IBrevisProof public immutable brevisProof;
    IBrevisRequest public immutable brevisRequest;
    IDelegationManager public immutable delegationManager;
    
    mapping(address => OperatorData) internal _operators;
    
    constructor(
        address _config,
        address _brevisProof,
        address _brevisRequest,
        address _delegationManager
    ) Ownable(msg.sender) {
        if (_config == address(0)) revert Errors.InvalidAddress();
        if (_brevisProof == address(0)) revert Errors.InvalidAddress();
        if (_brevisRequest == address(0)) revert Errors.InvalidAddress();
        if (_delegationManager == address(0)) revert Errors.InvalidAddress();

        config = SystemConfig(_config);
        brevisProof = IBrevisProof(_brevisProof);
        brevisRequest = IBrevisRequest(_brevisRequest);
        delegationManager = IDelegationManager(_delegationManager);
    }

    function registerOperator() external override nonReentrant whenNotPaused {
        if (_operators[msg.sender].isRegistered) revert Errors.AlreadyRegistered();
        if (!delegationManager.isOperator(msg.sender)) revert Errors.UnauthorizedOperator();

        _operators[msg.sender] = OperatorData({
            stake: 0,
            fraudCount: 0,
            isRegistered: true
        });

        emit OperatorRegistered(msg.sender, 0);
    }

    function setOperatorStake() external payable override nonReentrant whenNotPaused {
        if (!_operators[msg.sender].isRegistered) revert Errors.NotRegistered();
        if (msg.value < config.minStake()) revert Errors.InsufficientStake();
        if (msg.value > config.maxStake()) revert Errors.ExcessiveStake();

        _operators[msg.sender].stake = uint128(msg.value);
        emit StakeUpdated(msg.sender, msg.value);
    }

    function verifyFraudProof(
        address operator,
        bytes32 proofId,
        bytes calldata proofData
    ) external override nonReentrant returns (bool) {
        if (!_operators[operator].isRegistered) revert Errors.NotRegistered();

        (bool isValid, string memory error) = brevisProof.verifyFraudProof(proofId, proofData);
        
        if (!isValid) {
            _operators[operator].fraudCount++;
            if (_operators[operator].fraudCount >= config.maxFraudCount()) {
                _slashOperator(operator);
            }
        }

        emit FraudProofVerified(operator, proofId, isValid, error);
        return isValid;
    }

    function removeOperator(address operator) external override {
        // Only allow self-removal or removal by governance
        if (msg.sender != operator && msg.sender != owner()) revert Errors.UnauthorizedCaller();
        if (!_operators[operator].isRegistered) revert Errors.NotRegistered();

        delete _operators[operator];
        emit OperatorRemoved(operator);
    }

    function _slashOperator(address operator) internal {
        uint256 slashAmount = _operators[operator].stake * config.fraudPenalty() / 100;
        _operators[operator].stake -= uint128(slashAmount);
        _operators[operator].isRegistered = false;
        
        // Transfer slashed amount to treasury/burn address
        payable(address(0)).transfer(slashAmount);
        
        emit OperatorRemoved(operator);
    }

    // Emergency functions
    function pause() external {
        if (msg.sender != owner()) revert Errors.UnauthorizedCaller();
        _pause();
    }

    function unpause() external {
        if (msg.sender != owner()) revert Errors.UnauthorizedCaller();
        _unpause();
    }

    // Receive function to accept ETH
    receive() external payable {}

    function operators(address operator) external view override returns (OperatorData memory) {
        return _operators[operator];
    }
}