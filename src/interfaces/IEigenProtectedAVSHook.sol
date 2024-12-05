// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {OperatorData} from "../types/DataTypes.sol";

interface IEigenProtectedAVSHook {
    /// @notice Emitted when an operator is registered
    event OperatorRegistered(address indexed operator, uint256 stake);

    /// @notice Emitted when an operator is removed
    event OperatorRemoved(address indexed operator);

    /// @notice Emitted when an operator's stake is updated
    event StakeUpdated(address indexed operator, uint256 newStake);

    /// @notice Emitted when a fraud proof is verified
    event FraudProofVerified(
        address indexed operator,
        bytes32 indexed proofId,
        bool isValid,
        string error
    );

    /// @notice Register as an operator
    function registerOperator() external;

    /// @notice Remove an operator
    /// @param operator Address of the operator to remove
    function removeOperator(address operator) external;

    /// @notice Set stake for an operator
    function setOperatorStake() external payable;

    /// @notice Verify a fraud proof for an operator
    /// @param operator Address of the operator
    /// @param proofId ID of the proof
    /// @param proofData The proof data to verify
    function verifyFraudProof(
        address operator,
        bytes32 proofId,
        bytes calldata proofData
    ) external returns (bool);

    /// @notice Get operator data
    /// @param operator Address of the operator
    function operators(address operator) external view returns (OperatorData memory);
} 