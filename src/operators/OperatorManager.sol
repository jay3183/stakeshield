// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

abstract contract OperatorManager is Ownable {
    struct OperatorData {
        uint128 stake;
        uint128 fraudCount;
        bool isRegistered;
    }

    mapping(address => OperatorData) public operators;
    
    event OperatorRegistered(address indexed operator);
    event OperatorRemoved(address indexed operator);
    event StakeUpdated(address indexed operator, uint256 amount);
    event OperatorSlashed(address indexed operator, uint256 fraudCount);

    constructor(address initialOwner) Ownable(initialOwner) {}

    modifier onlyOperator() {
        require(operators[msg.sender].isRegistered, "Not registered operator");
        _;
    }

    function isActiveOperator(address operator) public view returns (bool) {
        return operators[operator].isRegistered && operators[operator].stake > 0;
    }

    function registerOperator() external {
        require(!operators[msg.sender].isRegistered, "Already registered");
        operators[msg.sender] = OperatorData({
            stake: 0,
            fraudCount: 0,
            isRegistered: true
        });
        emit OperatorRegistered(msg.sender);
    }

    function removeOperator(address operator) external virtual onlyOwner {
        require(operators[operator].isRegistered, "Operator not registered");
        operators[operator].isRegistered = false;
        emit OperatorRemoved(operator);
    }

    function getOperator(address operator) external view virtual returns (OperatorData memory) {
        return operators[operator];
    }
} 