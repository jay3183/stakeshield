// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IBrevisProof {
    /// @notice Verification states for Brevis proofs
    enum VerificationState {
        PENDING,
        VERIFIED,
        FAILED
    }

    /// @notice Verifies a fraud proof
    /// @param proofId The ID of the proof to verify
    /// @param data The proof data
    /// @return success Whether verification was successful
    /// @return error Error message if verification failed
    function verifyFraudProof(
        bytes32 proofId,
        bytes calldata data
    ) external returns (bool success, string memory error);

    /// @notice Gets the current state of a proof
    /// @param proofId The ID of the proof to check
    /// @return The verification state
    function getProofState(bytes32 proofId) external view returns (VerificationState);
} 