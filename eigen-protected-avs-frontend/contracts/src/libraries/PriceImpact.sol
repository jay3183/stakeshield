// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

library PriceImpact {
    function calculateImpact(uint256 oldPrice, uint256 newPrice) internal pure returns (uint256) {
        if (oldPrice == 0) return 0;
        return ((newPrice > oldPrice ? newPrice - oldPrice : oldPrice - newPrice) * 100) / oldPrice;
    }
}
