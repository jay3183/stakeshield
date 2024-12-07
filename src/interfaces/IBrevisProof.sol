// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

interface IBrevisProof {
    function verifyFraudProof(
        bytes32 proofId,
        bytes calldata data
    ) external returns (bool success, string memory error);
} 