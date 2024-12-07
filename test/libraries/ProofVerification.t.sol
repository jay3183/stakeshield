// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Test} from "forge-std/Test.sol";
import {ProofVerification} from "../../src/libraries/ProofVerification.sol";
import {MockBrevis} from "../mocks/MockBrevis.sol";
import {IBrevisProof} from "../../src/interfaces/IBrevisProof.sol";
import {IBrevisRequest} from "../../src/interfaces/IBrevisRequest.sol";

contract ProofVerificationTest is Test {
    MockBrevis public brevis;
    address public operator;
    bytes32 public requestId;

    function setUp() public {
        brevis = new MockBrevis();
        operator = makeAddr("operator");
        requestId = keccak256("test");
    }

    function testVerifyValidProof() public {
        brevis.setProofValidity(operator, true);
        bool isValid = ProofVerification.verifyFraudProof(
            IBrevisProof(address(brevis)),
            IBrevisRequest(address(brevis)),
            operator,
            requestId
        );
        assertTrue(isValid);
    }

    function testVerifyInvalidProof() public {
        brevis.setProofValidity(operator, false);
        bool isValid = ProofVerification.verifyFraudProof(
            IBrevisProof(address(brevis)),
            IBrevisRequest(address(brevis)),
            operator,
            requestId
        );
        assertFalse(isValid);
    }
} 