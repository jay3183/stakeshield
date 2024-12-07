// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {IDelegationManager} from "../../src/interfaces/IDelegationManager.sol";

contract MockEigenLayer is IDelegationManager {
    mapping(address => bool) private operators;
    mapping(address => uint256) private stakes;

    function registerAsOperator(bytes32[] calldata) external override {
        operators[msg.sender] = true;
    }

    function isOperator(address operator) external view override returns (bool) {
        return operators[operator];
    }

    function getOperatorStatus(address operator) external view override returns (
        bool isRegistered,
        uint256 totalStake,
        bool hasQuorum
    ) {
        return (operators[operator], stakes[operator], true);
    }

    // Helper functions
    function setOperator(address operator, bool status) external {
        operators[operator] = status;
    }

    function depositAsOperator() external payable {
        require(operators[msg.sender], "Not an operator");
        stakes[msg.sender] += msg.value;
    }

    function withdrawAsOperator(uint256 amount) external {
        require(operators[msg.sender], "Not an operator");
        require(stakes[msg.sender] >= amount, "Insufficient balance");
        stakes[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
}