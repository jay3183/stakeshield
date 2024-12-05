// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MockAVS {
    uint256 private volatility = 50;
    uint256 private riskFactor = 30;

    function setVolatility(uint256 _volatility) external {
        volatility = _volatility;
    }

    function setRiskFactor(uint256 _riskFactor) external {
        riskFactor = _riskFactor;
    }

    function verifyProof(bytes calldata) external pure returns (bool) {
        return false; // Mock implementation
    }

    function getAggregatedData(bytes calldata params) external view returns (uint256) {
        if (keccak256(params) == keccak256(abi.encode("volatility"))) {
            return volatility;
        } else if (keccak256(params) == keccak256(abi.encode("risk"))) {
            return riskFactor;
        }
        return 0;
    }

    function syncCrossChainState(bytes calldata) external pure {
        // Mock implementation
    }

    function checkFraudProof(bytes calldata) external pure returns (bool) {
        return true; // Mock implementation
    }

    function slash(address, uint256) external pure {
        // Mock implementation
    }

    function restake(address, uint256) external pure {
        // Mock implementation
    }
}
