// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {IDelegationManager} from "../../src/interfaces/IDelegationManager.sol";

abstract contract MockEigenLayer is IDelegationManager {
    mapping(address => bool) private operators;
    mapping(address => uint256) private stakes;
    
    function registerAsOperator(bytes32[] calldata) external {
        operators[msg.sender] = true;
    }

    function isOperator(address operator) external view returns (bool) {
        return operators[operator];
    }

    function getOperatorStatus(address operatorAddr) external view returns (
        bool isRegistered,
        uint256 totalStake,
        bool hasQuorum
    ) {
        return (operators[operatorAddr], stakes[operatorAddr], true);
    }
}