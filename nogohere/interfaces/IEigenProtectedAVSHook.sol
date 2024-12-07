// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {OperatorData} from "../types/DataTypes.sol";

interface IEigenProtectedAVSHook {
    event OperatorRegistered(address indexed operator, uint256 stake);
    event OperatorRemoved(address indexed operator);
    event StakeUpdated(address indexed operator, uint256 newStake);
    event FraudProofVerified(
        address indexed operator,
        bytes32 indexed proofId,
        bool isValid,
        string error
    );

    function registerOperator() external;
    function removeOperator(address operator) external;
    function setOperatorStake() external payable;
    function verifyFraudProof(
        address operator,
        bytes32 proofId,
        bytes calldata proofData
    ) external returns (bool);
    function operators(address operator) external view returns (OperatorData memory);
}
