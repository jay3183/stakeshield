// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IDelegationManager {
    function registerAsOperator() external;
    function isOperator(address operator) external view returns (bool);
    function depositAsOperator() external payable;
    function withdrawAsOperator(uint256 amount) external;
} 