// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AggregatorV3Interface} from "lib/chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract EigenProtectedAVSStorage {
    // Optimized storage layout
    struct OperatorData {
        uint128 stake;
        uint128 fraudCount;
        bool isRegistered;
    }

    // Core storage
    mapping(address => OperatorData) public operators;
    mapping(address => AggregatorV3Interface) public priceFeeds;
    uint256 private _previousPriceRatio;

    // Security storage
    bool public paused;
    uint256 public totalOperators;
    uint256 public lastUpdateTimestamp;
    mapping(address => uint256) public lastActionTimestamp;
    mapping(address => uint256) public consecutiveFailures;
    mapping(address => uint256) public lastStakeTime;
    uint256 public totalStake;

    // Constants
    uint256 internal constant MAX_FRAUD_COUNT = 3;
    uint256 internal constant SLASH_AMOUNT = 1 ether;
    uint256 internal constant PRICE_DEVIATION_THRESHOLD_BPS = 500;
    uint256 internal constant PRICE_STALENESS_THRESHOLD = 24 hours;
    uint256 internal constant GAS_PRICE_THRESHOLD = 30 gwei;
    uint24 internal constant BASE_FEE = 3000;
    uint24 internal constant MAX_FEE = 10000;
    uint24 internal constant MIN_FEE = 500;
    uint256 internal constant MINIMUM_STAKE = 0.01 ether;
    uint256 internal constant WITHDRAWAL_COOLDOWN = 7 days;
    uint256 internal constant MAX_PRICE_IMPACT = 1000;
    uint256 internal constant MAX_TOTAL_STAKE = 1000 ether;
    uint256 internal constant MAX_OPERATORS = 1000;
    uint256 internal constant MAX_CONSECUTIVE_FAILURES = 3;
    uint256 internal constant MIN_ACTION_DELAY = 1 hours;
    uint256 internal constant MAX_ACTION_DELAY = 30 days;
} 