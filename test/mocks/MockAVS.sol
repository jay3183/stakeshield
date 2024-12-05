// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MockAVS {
    uint256 private volatility;
    uint256 private riskFactor;
    bool private proofValid;

    function setVolatility(uint256 _volatility) external {
        volatility = _volatility;
    }

    function setRiskFactor(uint256 _risk) external {
        riskFactor = _risk;
    }

    function setProofValidity(bool _valid) external {
        proofValid = _valid;
    }

    function verifyProof(bytes calldata) external view returns (bool) {
        return proofValid;
    }

    function getAggregatedData(bytes calldata params) external view returns (uint256) {
        if (keccak256(params) == keccak256(abi.encode("volatility"))) {
            return volatility;
        }
        return riskFactor;
    }

    function slash(address, uint256) external pure returns (bool) {
        return true;
    }
} 