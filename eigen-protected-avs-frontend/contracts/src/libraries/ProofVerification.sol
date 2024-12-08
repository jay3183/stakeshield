// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {IBrevisProof} from "../interfaces/IBrevisProof.sol";

library ProofVerification {
    function verifyFraudProof(
        IBrevisProof brevisProof,
        bytes32 proofId,
        bytes calldata proofData
    ) internal view returns (bool isValid, string memory error) {
        return brevisProof.verifyFraudProof(proofId, proofData);
    }
}