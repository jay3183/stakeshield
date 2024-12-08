// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

interface IDelegationManager {
    function registerAsOperator(bytes32[] calldata) external;
    function isOperator(address operator) external view returns (bool);
    function getOperatorStatus(address operatorAddr) external view returns (
        bool isRegistered,
        uint256 totalStake,
        bool hasQuorum
    );
}