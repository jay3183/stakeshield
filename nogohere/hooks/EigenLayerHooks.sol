// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Hooks} from "../../lib/v4-core/src/libraries/Hooks.sol";
import {IPoolManager} from "../../lib/v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "../../lib/v4-core/src/types/PoolKey.sol";
import {BalanceDelta} from "../../lib/v4-core/src/types/BalanceDelta.sol";
import {IDelegationManager} from "../interfaces/IDelegationManager.sol";
import {Errors} from "../libraries/Errors.sol";
import {PriceImpact} from "../libraries/PriceImpact.sol";
import {SystemConfig} from "../config/SystemConfig.sol";
import {IHooks} from "../../lib/v4-core/src/interfaces/IHooks.sol";
import {Currency} from "../../lib/v4-core/src/types/Currency.sol";

abstract contract EigenLayerHooks {
    SystemConfig public immutable config;
    IDelegationManager public immutable delegationManager;

    constructor(address _config, address _delegationManager) {
        if (_config == address(0)) revert Errors.InvalidAddress();
        if (_delegationManager == address(0)) revert Errors.InvalidAddress();
        
        config = SystemConfig(_config);
        delegationManager = IDelegationManager(_delegationManager);
    }

    modifier onlyRegisteredOperator(address operator) {
        if (!delegationManager.isOperator(operator)) {
            revert Errors.UnauthorizedOperator();
        }
        _;
    }

    function validateHookAddress(address hook) internal view {
        require(hook.code.length > 0, "Hook address has no code");
    }

    function beforeInitialize(
        address operator,
        PoolKey calldata,
        uint160,
        bytes calldata
    ) external virtual onlyRegisteredOperator(operator) returns (bytes4) {
        return this.beforeInitialize.selector;
    }

    function afterInitialize(
        address operator,
        PoolKey calldata,
        uint160,
        bytes calldata
    ) external virtual onlyRegisteredOperator(operator) returns (bytes4) {
        return this.afterInitialize.selector;
    }

    function beforeSwap(
        address operator,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        bytes calldata hookData
    ) external virtual onlyRegisteredOperator(operator) returns (bytes4) {
        // Validate price impact
        uint256 impact = PriceImpact.calculatePriceImpact(
            uint256(params.amountSpecified < 0 ? -params.amountSpecified : params.amountSpecified),
            params.sqrtPriceLimitX96,
            uint256(uint160(Currency.unwrap(key.currency0))),
            uint256(uint160(Currency.unwrap(key.currency1)))
        );
        PriceImpact.validatePriceImpact(impact, config.maxPriceImpact());

        return this.beforeSwap.selector;
    }

    function afterSwap(
        address operator,
        PoolKey calldata,
        IPoolManager.SwapParams calldata,
        BalanceDelta,
        bytes calldata
    ) external virtual onlyRegisteredOperator(operator) returns (bytes4) {
        return this.afterSwap.selector;
    }

    function beforeDonate(
        address operator,
        PoolKey calldata,
        uint256,
        uint256,
        bytes calldata
    ) external virtual onlyRegisteredOperator(operator) returns (bytes4) {
        return this.beforeDonate.selector;
    }

    function afterDonate(
        address operator,
        PoolKey calldata,
        uint256,
        uint256,
        bytes calldata
    ) external virtual onlyRegisteredOperator(operator) returns (bytes4) {
        return IHooks.afterDonate.selector;
    }

    // Additional helper functions
    function _validateOperatorStake(address operator) internal view {
        (bool isRegistered, uint256 stake,) = delegationManager.getOperatorStatus(operator);
        if (!isRegistered) revert Errors.NotRegistered();
        if (stake < config.minStake()) revert Errors.InsufficientStake();
        if (stake > config.maxStake()) revert Errors.ExcessiveStake();
    }

    function _validateOperatorStatus(address operator) internal view {
        (bool isRegistered,,bool hasQuorum) = delegationManager.getOperatorStatus(operator);
        if (!isRegistered || !hasQuorum) revert Errors.UnauthorizedOperator();
    }
}
