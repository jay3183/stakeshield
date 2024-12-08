// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library Constants {
    uint256 constant MIN_STAKE = 1 ether;
    uint256 constant MAX_STAKE = 100_000 ether;
    uint256 constant MAX_FRAUD_COUNT = 3;
    uint256 constant FRAUD_PENALTY = 50; // 50% penalty
    uint256 constant MAX_PRICE_IMPACT = 100; // 1%
    uint256 constant UNSTAKE_DELAY = 7 days;
} 