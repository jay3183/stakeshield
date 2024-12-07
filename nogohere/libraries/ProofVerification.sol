// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/IBrevisProof.sol";

library ProofVerification {
    error InvalidProof(string reason);
    error VerificationFailed(string reason);
    error MerkleProofInvalid();
    error TimestampInvalid();

    function verifyProof(
        IBrevisProof brevisProof,
        bytes32 proofId,
        bytes calldata data
    ) internal returns (bool success) {
        (bool verified, string memory error) = brevisProof.verifyFraudProof(proofId, data);
        
        if (!verified) {
            if (bytes(error).length > 0) {
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
