// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Test} from "forge-std/Test.sol";
import {PoolKey} from "lib/v4-core/src/types/PoolKey.sol";
import {Currency} from "lib/v4-core/src/types/Currency.sol";
import {IPoolManager} from "lib/v4-core/src/interfaces/IPoolManager.sol";
import {IHooks} from "lib/v4-core/src/interfaces/IHooks.sol";

contract TestHelper is Test {
    function createPoolKey(
        address token0,
        address token1,
        uint24 fee,
        address hooks
    ) internal pure returns (PoolKey memory) {
        return PoolKey({
            currency0: Currency.wrap(token0),
            currency1: Currency.wrap(token1),
            fee: fee,
            hooks: IHooks(hooks),
            tickSpacing: 60
        });
    }

    function createSwapParams(
        bool zeroForOne,
        int256 amount,
        uint160 sqrtPriceLimitX96
    ) internal pure returns (IPoolManager.SwapParams memory) {
        return IPoolManager.SwapParams({
            zeroForOne: zeroForOne,
            amountSpecified: amount,
            sqrtPriceLimitX96: sqrtPriceLimitX96
        });
    }

    function createDonateParams(
        uint256 amount0,
        uint256 amount1
    ) internal pure returns (uint256, uint256) {
        return (amount0, amount1);
    }
} 