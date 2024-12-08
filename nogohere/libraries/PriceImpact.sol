// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

library PriceImpact {
    error ExcessivePriceImpact();

    function calculatePriceImpact(
        uint256 amountIn,
        uint256 amountOut,
        uint256 reserveIn,
        uint256 reserveOut
    ) internal pure returns (uint256) {
        uint256 priceBeforeSwap = (reserveOut * 1e18) / reserveIn;
        uint256 priceAfterSwap = (amountOut * 1e18) / amountIn;
        
        if (priceBeforeSwap < priceAfterSwap) {
            return ((priceAfterSwap - priceBeforeSwap) * 1e18) / priceBeforeSwap;
        } else {
            return ((priceBeforeSwap - priceAfterSwap) * 1e18) / priceBeforeSwap;
        }
    }

    function validatePriceImpact(
        uint256 priceImpact,
        uint256 maxImpact
    ) internal pure {
        if (priceImpact > maxImpact) {
            revert ExcessivePriceImpact();
        }
    }
}
