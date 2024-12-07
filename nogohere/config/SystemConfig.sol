// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract SystemConfig is Ownable {
    uint256 public minStake;
    uint256 public maxStake;
    uint256 public fraudPenalty;
    uint256 public maxFraudCount;
    uint256 public unstakeDelay;
    uint256 public maxPriceImpact;

    event ConfigUpdated(string parameter, uint256 value);

    constructor(
        uint256 _minStake,
        uint256 _maxStake,
        uint256 _fraudPenalty,
        uint256 _maxFraudCount,
        uint256 _unstakeDelay,
        uint256 _maxPriceImpact
    ) Ownable(msg.sender) {
        minStake = _minStake;
        maxStake = _maxStake;
        fraudPenalty = _fraudPenalty;
        maxFraudCount = _maxFraudCount;
        unstakeDelay = _unstakeDelay;
        maxPriceImpact = _maxPriceImpact;
    }

    function setMinStake(uint256 _minStake) external onlyOwner {
        minStake = _minStake;
        emit ConfigUpdated("minStake", _minStake);
    }

    function setMaxStake(uint256 _maxStake) external onlyOwner {
        maxStake = _maxStake;
        emit ConfigUpdated("maxStake", _maxStake);
    }

    function setFraudPenalty(uint256 _fraudPenalty) external onlyOwner {
        fraudPenalty = _fraudPenalty;
        emit ConfigUpdated("fraudPenalty", _fraudPenalty);
    }

    function setMaxFraudCount(uint256 _maxFraudCount) external onlyOwner {
        maxFraudCount = _maxFraudCount;
        emit ConfigUpdated("maxFraudCount", _maxFraudCount);
    }

    function setUnstakeDelay(uint256 _unstakeDelay) external onlyOwner {
        unstakeDelay = _unstakeDelay;
        emit ConfigUpdated("unstakeDelay", _unstakeDelay);
    }

    function setMaxPriceImpact(uint256 _maxPriceImpact) external onlyOwner {
        maxPriceImpact = _maxPriceImpact;
        emit ConfigUpdated("maxPriceImpact", _maxPriceImpact);
    }
}
