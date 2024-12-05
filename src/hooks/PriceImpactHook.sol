// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IHooks} from "lib/v4-core/src/interfaces/IHooks.sol";
import {PoolKey} from "lib/v4-core/src/types/PoolKey.sol";
import {IPoolManager} from "lib/v4-core/src/interfaces/IPoolManager.sol";
import {PriceImpact} from "../libraries/PriceImpact.sol";

abstract contract PriceImpactHook is IHooks {
    uint256 public constant MAX_PRICE_IMPACT = 100; // 1%

    function beforeSwap(
        address,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        bytes calldata
    ) external view returns (bytes4) {
        uint256 impact = PriceImpact.calculatePriceImpact(
            params.amountIn,
            params.amountOut,
            key.reserve0,
            key.reserve1
        );
        
        PriceImpact.validatePriceImpact(impact, MAX_PRICE_IMPACT);
        return IHooks.beforeSwap.selector;
    }
} 