// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import { IHooks } from "../../lib/v4-core/src/interfaces/IHooks.sol";
import { PoolKey } from "../../lib/v4-core/src/types/PoolKey.sol";
import { IEigenProtectedAVSHook } from "./interfaces/IEigenProtectedAVSHook.sol";
import { SystemConfig } from "./config/SystemConfig.sol";
import { Errors } from "./libraries/Errors.sol";
import { IBrevisProof } from "./interfaces/IBrevisProof.sol";
import { IDelegationManager } from "./interfaces/IDelegationManager.sol";
import { Ownable } from "../../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "../../lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import { Pausable } from "../../lib/openzeppelin-contracts/contracts/utils/Pausable.sol";
import { IPoolManager } from "../../lib/v4-core/src/interfaces/IPoolManager.sol";
import { BalanceDelta } from "../../lib/v4-core/src/types/BalanceDelta.sol";
import {BeforeSwapDelta} from "../../lib/v4-core/src/types/BeforeSwapDelta.sol";

contract EigenProtectedAVSHook is IHooks, ReentrancyGuard, Pausable, Ownable {
    // State variables
    SystemConfig public immutable config;
    IBrevisProof public immutable brevisProof;
    IDelegationManager public immutable delegationManager;

    struct Operator {
        uint256 stake;
        uint256 fraudCount;
        bool isRegistered;
    }

    mapping(address => Operator) private operators;

    event OperatorRegistered(address indexed operator, uint256 stake);
    event StakeUpdated(address indexed operator, uint256 stake);
    event OperatorActionProcessed(address indexed operator, bytes customData);
    event FraudDetected(address indexed operator, bytes data);
    event SwapExecuted(address indexed pool, address indexed sender, uint256 amount);
    event OperatorRemoved(address indexed operator);

    constructor(
        address _config,
        address _brevisProof,
        address _delegationManager
    ) Ownable(msg.sender) {
        require(_config != address(0), "Invalid config address");
        require(_brevisProof != address(0), "Invalid Brevis Proof address");
        require(_delegationManager != address(0), "Invalid Delegation Manager address");

        config = SystemConfig(_config);
        brevisProof = IBrevisProof(_brevisProof);
        delegationManager = IDelegationManager(_delegationManager);
    }

    modifier onlyRegistered() {
        require(operators[msg.sender].isRegistered, "Not a registered operator");
        _;
    }

    modifier whenSystemNotPaused() {
        require(!config.paused(), "System is paused");
        _;
    }

    function registerOperator() external whenSystemNotPaused {
        require(!operators[msg.sender].isRegistered, "Operator already registered");

        operators[msg.sender] = Operator({stake: 0, fraudCount: 0, isRegistered: true});
        emit OperatorRegistered(msg.sender, 0);
    }

    function setStake() external payable whenSystemNotPaused {
        require(msg.value >= config.minStake(), "Insufficient stake");
        operators[msg.sender].stake += msg.value;
        emit StakeUpdated(msg.sender, operators[msg.sender].stake);
    }

    function processOperatorAction(address operator, bytes calldata customData) external whenSystemNotPaused {
        require(operators[operator].isRegistered, "Operator not registered");
        require(customData.length > 0, "Invalid custom data");

        // Fraud detection logic
        bool isFraudulent = brevisProof.detectAnomalies(operator, customData);
        if (isFraudulent) {
            operators[operator].fraudCount++;
            emit FraudDetected(operator, customData);
            if (operators[operator].fraudCount > config.maxFraudCount()) {
                operators[operator].isRegistered = false;
            }
            revert("Fraud detected");
        }

        // Custom operator action logic
        emit OperatorActionProcessed(operator, customData);
    }

    // Uniswap V4 Hooks
    function beforeSwap(
        address pool,
        PoolKey calldata,
        IPoolManager.SwapParams calldata params,
        bytes calldata data
    ) external whenSystemNotPaused returns (bytes4, BeforeSwapDelta, uint24) {
        // Check if the sender is a registered operator
        require(operators[msg.sender].isRegistered, "Not a registered operator");
        
        // Fraud detection for pre-swap
        bool isFraudulent = brevisProof.detectAnomalies(
            msg.sender,
            abi.encode(pool, params.zeroForOne, params.amountSpecified)
        );
        
        if (isFraudulent) {
            operators[msg.sender].fraudCount++;
            emit FraudDetected(msg.sender, data);
            
            if (operators[msg.sender].fraudCount > config.maxFraudCount()) {
                operators[msg.sender].isRegistered = false;
                emit OperatorRemoved(msg.sender);
            }
            revert("Fraud detected in pre-swap");
        }

        emit SwapExecuted(pool, msg.sender, abi.decode(data, (uint256)));
        return (IHooks.beforeSwap.selector, BeforeSwapDelta.wrap(0), 0);
    }

    function afterSwap(
        address pool,
        PoolKey calldata,
        IPoolManager.SwapParams calldata,
        BalanceDelta delta,
        bytes calldata data
    ) external whenSystemNotPaused returns (bytes4, int128) {
        // Check if the sender is a registered operator
        require(operators[msg.sender].isRegistered, "Not a registered operator");
        
        // Fraud detection for post-swap
        bool isFraudulent = brevisProof.detectAnomalies(
            msg.sender,
            abi.encode(pool, delta.amount0(), delta.amount1())
        );
        
        if (isFraudulent) {
            operators[msg.sender].fraudCount++;
            emit FraudDetected(msg.sender, data);
            
            if (operators[msg.sender].fraudCount > config.maxFraudCount()) {
                operators[msg.sender].isRegistered = false;
                emit OperatorRemoved(msg.sender);
            }
            revert("Fraud detected in post-swap");
        }

        // Convert to absolute value for the event
        int128 amount0 = delta.amount0();
        uint256 absoluteAmount = amount0 >= 0 ? uint256(uint128(amount0)) : uint256(uint128(-amount0));
        
        emit SwapExecuted(pool, msg.sender, absoluteAmount);
        return (IHooks.afterSwap.selector, 0);
    }

    function removeOperator(address operator) external {
        require(
            config.hasRole(config.OPERATOR_MANAGER_ROLE(), msg.sender),
            "Caller is not an operator manager"
        );
        require(operators[operator].isRegistered, "Not a registered operator");
        
        // Return stake if any
        if (operators[operator].stake > 0) {
            uint256 stakeToReturn = operators[operator].stake;
            operators[operator].stake = 0;
            payable(operator).transfer(stakeToReturn);
        }
        
        operators[operator].isRegistered = false;
        emit OperatorRemoved(operator);
    }

    // Emergency controls
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    receive() external payable {}

    // Add these functions to satisfy IHooks interface
    function beforeInitialize(address, PoolKey calldata, uint160) external pure returns (bytes4) {
        return IHooks.beforeInitialize.selector;
    }

    function afterInitialize(address, PoolKey calldata, uint160, int24) external pure returns (bytes4) {
        return IHooks.afterInitialize.selector;
    }

    function beforeDonate(address, PoolKey calldata, uint256, uint256, bytes calldata) external pure returns (bytes4) {
        return IHooks.beforeDonate.selector;
    }

    function afterDonate(address, PoolKey calldata, uint256, uint256, bytes calldata) external pure returns (bytes4) {
        return IHooks.afterDonate.selector;
    }

    function beforeAddLiquidity(address, PoolKey calldata, IPoolManager.ModifyLiquidityParams calldata, bytes calldata) external pure returns (bytes4) {
        return IHooks.beforeAddLiquidity.selector;
    }

    function afterAddLiquidity(address, PoolKey calldata, IPoolManager.ModifyLiquidityParams calldata, BalanceDelta, BalanceDelta, bytes calldata) external pure returns (bytes4, BalanceDelta) {
        return (IHooks.afterAddLiquidity.selector, BalanceDelta.wrap(0));
    }

      function beforeRemoveLiquidity(address, PoolKey calldata, IPoolManager.ModifyLiquidityParams calldata, bytes calldata) external pure returns (bytes4) {
        return IHooks.beforeRemoveLiquidity.selector;
    }

    function afterRemoveLiquidity(address, PoolKey calldata, IPoolManager.ModifyLiquidityParams calldata, BalanceDelta, BalanceDelta, bytes calldata) external pure returns (bytes4, BalanceDelta) {
        return (IHooks.afterRemoveLiquidity.selector, BalanceDelta.wrap(0));
    }
}
