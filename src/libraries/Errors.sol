// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

library Errors {
    error NotRegistered();
    error AlreadyRegistered();
    error InsufficientStake();
    error InvalidProof();
    error ProofAlreadyVerified();
    error OperatorHasFraudProof();
    error NotRegisteredWithEigenLayer();
} 