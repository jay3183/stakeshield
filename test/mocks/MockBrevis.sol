// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../../src/interfaces/IBrevisProof.sol";

contract MockBrevis is IBrevisProof {
    mapping(bytes32 => VerificationState) private proofStates;
    mapping(bytes32 => string) private proofErrors;
    bool private proofValidity;

    function setProofValidity(bool validity) external {
        proofValidity = validity;
    }

    function verifyFraudProof(
        bytes32 proofId,
        bytes calldata data
    ) external override returns (bool success, string memory error) {
        // Mock verification logic
        if (data.length == 0) {
            proofStates[proofId] = VerificationState.FAILED;
            proofErrors[proofId] = "Empty proof data";
            return (false, "Empty proof data");
        }

        // Mock different error cases based on first byte
        if (data[0] == 0x01) {
            proofStates[proofId] = VerificationState.FAILED;
            proofErrors[proofId] = "merkle proof invalid";
            return (false, "merkle proof invalid");
        }
        if (data[0] == 0x02) {
            proofStates[proofId] = VerificationState.FAILED;
            proofErrors[proofId] = "timestamp invalid";
            return (false, "timestamp invalid");
        }

        proofStates[proofId] = VerificationState.VERIFIED;
        return (proofValidity, "");
    }

    function getProofState(bytes32 proofId) external view override returns (VerificationState) {
        return proofStates[proofId];
    }

    function getProofError(bytes32 proofId) external view returns (string memory) {
        return proofErrors[proofId];
    }
}