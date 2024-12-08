// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {OperatorData} from "../types/DataTypes.sol";

interface IEigenProtectedAVSHook {
    event OperatorRegistered(address indexed operator, uint256 stake);
    event StakeUpdated(address indexed operator, uint256 newStake);
    event OperatorRemoved(address indexed operator);
    event FraudProofVerified(address indexed operator, bytes32 proofId, bool isValid, string error);

    function registerOperator() external;
    function setOperatorStake() external payable;
    function verifyFraudProof(address operator, bytes32 proofId, bytes calldata proofData) external returns (bool);
    function processOperatorAction(address operator, bytes calldata customData) external;
    function removeOperator(address operator) external;
    function operators(address operator) external view returns (OperatorData memory);
}