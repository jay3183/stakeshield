// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPoolManager} from "lib/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "lib/v4-core/src/types/PoolKey.sol";
import {Currency} from "lib/v4-core/src/types/Currency.sol";
import {BalanceDelta} from "lib/v4-core/src/types/BalanceDelta.sol";

contract MockPoolManager is IPoolManager {
    // Mock implementations - return dummy values
    function extsload(bytes32 slot) external pure returns (bytes32 value) {}
    function extsload(bytes32 startSlot, uint256 nSlots) external pure returns (bytes32[] memory values) {}
    function extsload(bytes32[] calldata slots) external pure returns (bytes32[] memory values) {}
    function exttload(bytes32 slot) external pure returns (bytes32 value) {}
    function exttload(bytes32[] calldata slots) external pure returns (bytes32[] memory values) {}
    
    function initialize(PoolKey calldata, uint160) external pure returns (int24) { return 0; }
    function lock(bytes calldata) external pure returns (bytes memory) { return ""; }
    
    function modifyLiquidity(
        PoolKey memory,
        ModifyLiquidityParams memory,
        bytes calldata
    ) external pure override returns (BalanceDelta callerDelta, BalanceDelta feesAccrued) {
        return (BalanceDelta.wrap(0), BalanceDelta.wrap(0));
    }
    
    function swap(PoolKey calldata, IPoolManager.SwapParams calldata, bytes calldata)
        external
        pure
        returns (BalanceDelta)
    {
        return BalanceDelta.wrap(0);
    }
    
    function donate(PoolKey calldata, uint256, uint256, bytes calldata)
        external
        pure
        returns (BalanceDelta)
    {
        return BalanceDelta.wrap(0);
    }
    
    function take(Currency currency, address to, uint256 amount) external pure {}
    function settle(Currency currency) external pure {}
    function mint(address to, uint256 id, uint256 amount) external pure {}
    function burn(address from, uint256 id, uint256 amount) external pure {}
    function collectProtocolFees(
        address,
        Currency,
        uint256
    ) external pure returns (uint256) {
        return 0;
    }
    function setProtocolFee(PoolKey memory key, uint24 newProtocolFee) external pure {}
    function setProtocolFeeController(address controller) external pure {}
    
    // View functions
    function protocolFeesAccrued(Currency) external pure returns (uint256) {
        return 0;
    }
    function protocolFeeController() external pure returns (address) { return address(0); }
    function isOperator(address, address) external pure returns (bool) { return false; }
    function balanceOf(address, uint256) external pure returns (uint256) { return 0; }
    function allowance(address, address, uint256) external pure returns (uint256) { return 0; }
    
    // State-modifying functions with returns
    function approve(address, uint256, uint256) external pure returns (bool) { return true; }
    function transfer(address, uint256, uint256) external pure returns (bool) { return true; }
    function transferFrom(address, address, uint256, uint256) external pure returns (bool) { return true; }
    function setOperator(address, bool) external pure returns (bool) { return true; }
    function settle() external payable returns (uint256) { return 0; }
    function settleFor(address) external payable returns (uint256) {
        return 0;
    }
    
    // Additional required functions
    function sync(Currency) external pure {}
    function clear(Currency, uint256) external pure {}

    function unlock(bytes calldata) external pure returns (bytes memory) {
        return "";
    }

    function updateDynamicLPFee(PoolKey memory key, uint24 newDynamicLPFee) external pure {}
}
