// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract SystemConfig {
    uint256 public minStake;
    uint256 public maxStake;
    uint256 public maxFraudCount;
    uint256 public fraudPenalty;

    constructor(
        uint256 _minStake,
        uint256 _maxStake,
        uint256 _maxFraudCount,
        uint256 _fraudPenalty
    ) {
        minStake = _minStake;
        maxStake = _maxStake;
        maxFraudCount = _maxFraudCount;
        fraudPenalty = _fraudPenalty;
    }
}