// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract Networks {
    function getNetwork(uint256 chainId) public pure returns (string memory) {
        if (chainId == 1) return "mainnet";
        if (chainId == 5) return "goerli"; 
        if (chainId == 11155111) return "sepolia";
        return "unknown";
    }
} 