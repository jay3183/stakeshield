// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

interface IDelegationManager {
    function registerAsOperator(bytes32[] calldata operatorId) external;
    function isOperator(address operator) external view returns (bool);
    function getOperatorStatus(address operator) external view returns (
        bool isOperator,
        uint256 totalStake,
        bool hasQuorum
    );
}
