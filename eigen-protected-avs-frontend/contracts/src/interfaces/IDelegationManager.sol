// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

interface IDelegationManager {
    function isOperator(address operator) external view returns (bool);
}