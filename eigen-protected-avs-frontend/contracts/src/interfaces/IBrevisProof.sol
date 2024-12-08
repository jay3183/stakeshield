// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

interface IBrevisProof {
    function verifyFraudProof(bytes32 proofId, bytes calldata proofData) external view returns (bool isValid, string memory error);
    function detectAnomalies(address operator, bytes calldata data) external view returns (bool);
}