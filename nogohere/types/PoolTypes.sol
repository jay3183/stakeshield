// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Currency} from "../../lib/v4-core/src/types/Currency.sol";

struct PoolKey {
    Currency currency0;
    Currency currency1;
    uint24 fee;
    int24 tickSpacing;
    address hooks;
}

struct PoolParams {
    uint160 sqrtPriceX96;
    int24 tick;
    uint128 liquidity;
} 