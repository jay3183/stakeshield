// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IHooks} from "lib/v4-core/src/interfaces/IHooks.sol";
import {PoolKey} from "lib/v4-core/src/types/PoolKey.sol";
import {IPoolManager} from "lib/v4-core/src/interfaces/IPoolManager.sol";

contract UniswapHooks {
    function beforeSwap(
        address,  // sender
        PoolKey calldata,  // key
        IPoolManager.SwapParams calldata  // params
    ) external pure returns (bytes4) {
        return IHooks.beforeSwap.selector;
    }

    function afterSwap(
        address,  // sender
        PoolKey calldata,  // key
        IPoolManager.SwapParams calldata,  // params
        int256  // delta
    ) external pure returns (bytes4) {
        return IHooks.afterSwap.selector;
    }
} 