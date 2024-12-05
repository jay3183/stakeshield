// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IDelegationManager} from "../../src/interfaces/IDelegationManager.sol";

contract MockEigenLayer is IDelegationManager {
    mapping(address => bool) private operators;
    mapping(address => uint256) private stakes;

    function setOperator(address operator, bool status) external {
        operators[operator] = status;
    }

    function isOperator(address operator) external view override returns (bool) {
        return operators[operator];
    }

    function registerAsOperator() external override {
        operators[msg.sender] = true;
    }

    function depositAsOperator() external payable override {
        require(operators[msg.sender], "Not an operator");
        stakes[msg.sender] += msg.value;
    }

    function withdrawAsOperator(uint256 amount) external override {
        require(operators[msg.sender], "Not an operator");
        require(stakes[msg.sender] >= amount, "Insufficient balance");
        stakes[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    // Helper function for tests
    function getStake(address operator) external view returns (uint256) {
        return stakes[operator];
    }
}