// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library DeployConfig {
    struct Config {
        uint256 minStake;
        uint256 maxStake;
        uint256 fraudPenalty;
        uint256 maxFraudCount;
        uint256 unstakeDelay;
        uint256 maxPriceImpact;
    }

    function getConfig(uint256 chainId) internal pure returns (Config memory) {
        if (chainId == 1) { // Mainnet
            return Config({
                minStake: 32 ether,
                maxStake: 1000 ether,
                fraudPenalty: 50,
                maxFraudCount: 3,
                unstakeDelay: 7 days,
                maxPriceImpact: 100 // 1%
            });
        } else if (chainId == 11155111) { // Sepolia
            return Config({
                minStake: 1 ether,
                maxStake: 100 ether,
                fraudPenalty: 50,
                maxFraudCount: 3,
                unstakeDelay: 1 days,
                maxPriceImpact: 100
            });
        } else { // Local/Test
            return Config({
                minStake: 0.1 ether,
                maxStake: 10 ether,
                fraudPenalty: 50,
                maxFraudCount: 3,
                unstakeDelay: 1 hours,
                maxPriceImpact: 100
            });
        }
    }
} 