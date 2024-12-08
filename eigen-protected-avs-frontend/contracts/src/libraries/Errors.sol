// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

library Errors {
    error InvalidAddress();
    error AlreadyRegistered();
    error UnauthorizedOperator();
    error NotRegistered();
    error InsufficientStake();
    error ExcessiveStake();
    error UnauthorizedCaller();
    error FraudDetected();
}
