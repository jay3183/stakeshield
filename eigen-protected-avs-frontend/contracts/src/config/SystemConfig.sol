// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract SystemConfig is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER_ROLE");
    bytes32 public constant OPERATOR_MANAGER_ROLE = keccak256("OPERATOR_MANAGER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    uint256 public minStake;
    uint256 public maxStake;
    uint256 public maxFraudCount;
    uint256 public fraudPenalty;
    bool public paused;

    event MinStakeUpdated(uint256 newMinStake);
    event MaxStakeUpdated(uint256 newMaxStake);
    event MaxFraudCountUpdated(uint256 newMaxFraudCount);
    event FraudPenaltyUpdated(uint256 newFraudPenalty);
    event SystemPaused(address indexed pauser);
    event SystemUnpaused(address indexed pauser);

    constructor(
        uint256 _minStake,
        uint256 _maxStake,
        uint256 _maxFraudCount,
        uint256 _fraudPenalty
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(UPDATER_ROLE, msg.sender);
        _grantRole(OPERATOR_MANAGER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        
        minStake = _minStake;
        maxStake = _maxStake;
        maxFraudCount = _maxFraudCount;
        fraudPenalty = _fraudPenalty;
    }

    modifier whenNotPaused() {
        require(!paused, "System is paused");
        _;
    }

    function pause() external onlyRole(PAUSER_ROLE) {
        paused = true;
        emit SystemPaused(msg.sender);
    }

    function unpause() external onlyRole(PAUSER_ROLE) {
        paused = false;
        emit SystemUnpaused(msg.sender);
    }

    function updateMinStake(uint256 _minStake) external onlyRole(UPDATER_ROLE) whenNotPaused {
        require(_minStake <= maxStake, "Min stake must be <= max stake");
        minStake = _minStake;
        emit MinStakeUpdated(_minStake);
    }

    function updateMaxStake(uint256 _maxStake) external onlyRole(UPDATER_ROLE) whenNotPaused {
        require(_maxStake >= minStake, "Max stake must be >= min stake");
        maxStake = _maxStake;
        emit MaxStakeUpdated(_maxStake);
    }

    function updateMaxFraudCount(uint256 _maxFraudCount) external onlyRole(UPDATER_ROLE) whenNotPaused {
        maxFraudCount = _maxFraudCount;
        emit MaxFraudCountUpdated(_maxFraudCount);
    }

    function updateFraudPenalty(uint256 _fraudPenalty) external onlyRole(UPDATER_ROLE) whenNotPaused {
        fraudPenalty = _fraudPenalty;
        emit FraudPenaltyUpdated(_fraudPenalty);
    }
}