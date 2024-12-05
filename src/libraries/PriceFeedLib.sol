// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AggregatorV3Interface} from "lib/chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceFeedLib {
    error InvalidPriceFeed();
    error StalePrice();
    error InvalidPrice();

    function validatePriceFeed(
        AggregatorV3Interface priceFeed,
        uint256 stalenessThreshold
    ) internal view {
        if (address(priceFeed) == address(0)) revert InvalidPriceFeed();
        
        try priceFeed.latestRoundData() returns (
            uint80 roundId,
            int256 price,
            uint256,
            uint256 updatedAt,
            uint80 answeredInRound
        ) {
            if (price <= 0 ||
                roundId != answeredInRound ||
                block.timestamp - updatedAt > stalenessThreshold) {
                revert InvalidPrice();
            }
        } catch {
            revert InvalidPriceFeed();
        }
    }
} 