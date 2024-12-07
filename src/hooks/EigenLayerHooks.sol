// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Hooks} from "@uniswap/v4-core/contracts/libraries/Hooks.sol";
import {IPoolManager} from "@uniswap/v4-core/contracts/interfaces/IPoolManager.sol";
import {PoolKey} from "@uniswap/v4-core/contracts/types/PoolKey.sol";

abstract contract EigenLayerHooks {
    function validateHookAddress(address hook) internal pure {
        require(
            hook.code.length > 0,
            "Hook address has no code"
        );
    }

    // Hook callbacks
    function beforeInitialize(
        address operator,
        PoolKey calldata,
        uint160,
        bytes calldata
    ) external virtual returns (bytes4) {
        return Hooks.beforeInitialize.selector;
    }

    function afterInitialize(
        address operator,
        PoolKey calldata,
        uint160,
        bytes calldata
    ) external virtual returns (bytes4) {
        return Hooks.afterInitialize.selector;
    }

    function beforeSwap(
        address operator,
        PoolKey calldata,
        IPoolManager.SwapParams calldata,
        bytes calldata
    ) external virtual returns (bytes4) {
        return Hooks.beforeSwap.selector;
    }

    function afterSwap(
        address operator,
        PoolKey calldata,
        IPoolManager.SwapParams calldata,
        bytes calldata
    ) external virtual returns (bytes4) {
        return Hooks.afterSwap.selector;
    }
}
