// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {IPoolManager} from "lib/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "lib/v4-core/src/types/PoolKey.sol";
import {IHooks} from "lib/v4-core/src/interfaces/IHooks.sol";
import {Currency} from "lib/v4-core/src/types/Currency.sol";
import {BalanceDelta} from "lib/v4-core/src/types/BalanceDelta.sol";
import {PoolId} from "lib/v4-core/src/types/PoolId.sol";

contract MockPoolManager is IPoolManager {
    mapping(address => uint256) public balances;
    mapping(Currency => uint256) public reserves;
    mapping(bytes32 => bool) public pools;

    function _hashKey(PoolKey memory key) internal pure returns (bytes32) {
        return keccak256(abi.encode(key));
    }

    function swap(
        PoolKey memory key,
        IPoolManager.SwapParams memory,
        bytes calldata
    ) external pure returns (BalanceDelta) {
        if (address(key.hooks) != address(0)) {
            // Skip hook calls in mock
        }
        return BalanceDelta.wrap(0);
    }

    function initialize(PoolKey memory, uint160) external pure returns (int24) {
        return 0;
    }

    function modifyLiquidity(
        PoolKey memory key,
        IPoolManager.ModifyLiquidityParams memory,
        bytes calldata
    ) external pure returns (BalanceDelta callerDelta, BalanceDelta feesAccrued) {
        if (address(key.hooks) != address(0)) {
            // Skip hook calls in mock
        }
        return (BalanceDelta.wrap(0), BalanceDelta.wrap(0));
    }

    function donate(
        PoolKey memory,
        uint256,
        uint256,
        bytes calldata
    ) external pure returns (BalanceDelta) {
        return BalanceDelta.wrap(0);
    }

    function take(Currency, address, uint256) external pure {}
    function mint(address, uint256, uint256) external pure {}
    function burn(address, uint256, uint256) external pure {}
    function settle() external payable returns (uint256) { return 0; }
    function settleFor(address) external payable returns (uint256) { return 0; }
    function clear(Currency, uint256) external pure {}
    function sync(Currency) external pure {}
    function setProtocolFee(PoolKey memory, uint24) external pure {}
    function setProtocolFeeController(address) external pure {}
    function collectProtocolFees(address, Currency, uint256) external pure returns (uint256) { return 0; }
    function updateDynamicLPFee(PoolKey memory, uint24) external pure {}
    function protocolFeeController() external pure returns (address) { return address(0); }
    function protocolFeesAccrued(Currency) external pure returns (uint256) { return 0; }

    // ERC6909 interface
    function allowance(address, address, uint256) external pure returns (uint256) { return 0; }
    function approve(address, uint256, uint256) external pure returns (bool) { return true; }
    function balanceOf(address, uint256) external pure returns (uint256) { return 0; }
    function transfer(address, uint256, uint256) external pure returns (bool) { return true; }
    function transferFrom(address, address, uint256, uint256) external pure returns (bool) { return true; }
    function isOperator(address, address) external pure returns (bool) { return true; }
    function setOperator(address, bool) external pure returns (bool) { return true; }

    // Extsload/Exttload interface
    function extsload(bytes32) external pure returns (bytes32) { return bytes32(0); }
    function extsload(bytes32, uint256) external pure returns (bytes32[] memory) { return new bytes32[](0); }
    function extsload(bytes32[] calldata) external pure returns (bytes32[] memory) { return new bytes32[](0); }
    function exttload(bytes32) external pure returns (bytes32) { return bytes32(0); }
    function exttload(bytes32[] calldata) external pure returns (bytes32[] memory) { return new bytes32[](0); }

    function unlock(bytes calldata) external pure returns (bytes memory) { return ""; }
}
