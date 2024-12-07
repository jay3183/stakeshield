// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {AggregatorV3Interface} from "lib/chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract MockAggregator is AggregatorV3Interface {
    uint8 private immutable _decimals;
    int256 private _price;
    uint256 private _updatedAt;

    constructor(uint8 decimals_) {
        _decimals = decimals_;
    }

    function setPrice(int256 price_) external {
        _price = price_;
        _updatedAt = block.timestamp;
    }

    function decimals() external view override returns (uint8) {
        return _decimals;
    }

    function description() external pure override returns (string memory) {
        return "Mock Aggregator";
    }

    function version() external pure override returns (uint256) {
        return 1;
    }

    function getRoundData(uint80) external view override returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) {
        return (1, _price, block.timestamp, _updatedAt, 1);
    }

    function latestRoundData() external view override returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) {
        return (1, _price, block.timestamp, _updatedAt, 1);
    }
} 