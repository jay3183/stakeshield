// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

library Errors {
    error NotRegistered();
    error AlreadyRegistered();
    error InsufficientStake();
    error ExcessiveStake();
    error UnauthorizedOperator();
    error MaxFraudCountExceeded();
    error InvalidProofData();
    error StakeWithdrawalBlocked();
    error NoStakeToWithdraw();
    error InvalidConfig();
    error InvalidAddress();
    error ContractPaused();
    error UnauthorizedCaller();
    error InvalidAmount();
    error ExcessivePriceImpact();
    error InvalidPrice();
    error StalePrice();
} 