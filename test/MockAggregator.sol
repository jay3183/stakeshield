// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {AggregatorV3Interface} from "lib/chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract MockAggregator is AggregatorV3Interface {
    uint8 private _decimals;
    int256 private _price;
    int256 private _previousPrice;
    uint256 private _updatedAt;

    constructor(uint8 decimals_) {
        _decimals = decimals_;
        _updatedAt = block.timestamp;
    }

    function decimals() external view override returns (uint8) {
        return _decimals;
    }

    function description() external pure override returns (string memory) {
        return "Mock Price Feed";
    }

    function version() external pure override returns (uint256) {
        return 1;
    }

    function setPrice(int256 price_) external {
        _previousPrice = _price;
        _price = price_;
        _updatedAt = block.timestamp;
    }

    function setUpdatedAt(uint256 timestamp) external {
        _updatedAt = timestamp;
    }

    function getRoundData(uint80)
        external
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (0, _price, block.timestamp, _updatedAt, 0);
    }

    function latestRoundData()
        external
        view
        override
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (0, _price, block.timestamp, _updatedAt, 0);
    }
}