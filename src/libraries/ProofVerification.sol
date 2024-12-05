// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/IBrevisProof.sol";

library ProofVerification {
    /// @notice Error codes for verification failures
    error InvalidProof(string reason);
    error VerificationFailed(string reason);
    error MerkleProofInvalid();
    error TimestampInvalid();

    /// @notice Verifies a proof using the Brevis verifier
    /// @param brevisProof The Brevis proof verifier contract
    /// @param proofId The ID of the proof to verify
    /// @param data The proof data
    /// @return success Whether verification was successful
    function verifyProof(
        IBrevisProof brevisProof,
        bytes32 proofId,
        bytes calldata data
    ) internal returns (bool success) {
        (bool verified, string memory error) = brevisProof.verifyFraudProof(proofId, data);
        
        if (!verified) {
            if (bytes(error).length > 0) {
                // Check specific error conditions
                if (_contains(error, "merkle")) {
                    revert MerkleProofInvalid();
                }
                if (_contains(error, "timestamp")) {
                    revert TimestampInvalid();
                }
                revert VerificationFailed(error);
            }
            revert InvalidProof("Unknown verification error");
        }

        return true;
    }

    /// @notice Checks if a string contains a substring
    /// @param source The source string
    /// @param searchFor The substring to search for
    /// @return found Whether the substring was found
    function _contains(string memory source, string memory searchFor) private pure returns (bool found) {
        bytes memory sourceBytes = bytes(source);
        bytes memory searchBytes = bytes(searchFor);

        if (searchBytes.length > sourceBytes.length) {
            return false;
        }

        for (uint i = 0; i <= sourceBytes.length - searchBytes.length; i++) {
            bool isMatch = true;
            for (uint j = 0; j < searchBytes.length; j++) {
                if (sourceBytes[i + j] != searchBytes[j]) {
                    isMatch = false;
                    break;
                }
            }
            if (isMatch) {
                return true;
            }
        }
        return false;
    }
} 