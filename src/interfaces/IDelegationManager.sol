// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IDelegationManager {
    function registerAsOperator(bytes32[] calldata operatorId) external;
    function isOperator(address operator) external view returns (bool);
    function depositAsOperator() external payable;
    function withdrawAsOperator(uint256 amount) external;
    function getOperatorStatus(address operator) external view returns (
        uint256 stake,
        bool isActive,
        uint32 fraudCount
    );
} 