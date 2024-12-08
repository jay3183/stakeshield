// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

struct OperatorData {
    uint128 stake;
    uint128 fraudCount;
    bool isRegistered;
}

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