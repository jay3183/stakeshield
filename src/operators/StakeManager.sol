// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

abstract contract StakeManager is ReentrancyGuard {
    uint256 public constant MIN_STAKE = 1 ether;
    uint256 public constant MAX_STAKE = 1000 ether;
    uint256 public constant UNSTAKE_DELAY = 7 days;

    mapping(address => uint256) public lastStakeTimestamp;
    mapping(address => uint256) public pendingUnstake;

    event StakeInitiated(address indexed operator, uint256 amount);
    event UnstakeInitiated(address indexed operator, uint256 amount);
    event UnstakeCompleted(address indexed operator, uint256 amount);

    error InsufficientStake();
    error StakeTooLarge();
    error UnstakeDelayNotMet();
    error NoStakeToUnstake();

    function initiateStake() external payable virtual {
        if (msg.value < MIN_STAKE) revert InsufficientStake();
        if (msg.value > MAX_STAKE) revert StakeTooLarge();

        lastStakeTimestamp[msg.sender] = block.timestamp;
        emit StakeInitiated(msg.sender, msg.value);
    }

    function initiateUnstake(uint256 amount) external virtual {
        if (amount == 0) revert NoStakeToUnstake();
        
        pendingUnstake[msg.sender] = amount;
        emit UnstakeInitiated(msg.sender, amount);
    }

    function completeUnstake() external nonReentrant virtual {
        uint256 amount = pendingUnstake[msg.sender];
        if (amount == 0) revert NoStakeToUnstake();
        
        if (block.timestamp < lastStakeTimestamp[msg.sender] + UNSTAKE_DELAY) {
            revert UnstakeDelayNotMet();
        }

        pendingUnstake[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        emit UnstakeCompleted(msg.sender, amount);
    }
} 