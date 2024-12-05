// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library Networks {
    function getPoolManager() internal view returns (address) {
        if (block.chainid == 1) {
            return address(0); // Mainnet address
        } else if (block.chainid == 17000) {
            return 0x4b8c70cF3e595e74825A06c44E478bC5665AA734; // Holesky address
        }
        revert("Unsupported network");
    }

    function getBrevisAddress() internal view returns (address) {
        if (block.chainid == 1) {
            return address(0); // Mainnet address
        } else if (block.chainid == 17000) {
            return 0x4b8c70cF3e595e74825A06c44E478bC5665AA734; // Holesky address
        }
        revert("Unsupported network");
    }

    function getEigenLayerAddress() internal view returns (address) {
        if (block.chainid == 1) {
            return address(0); // Mainnet address
        } else if (block.chainid == 17000) {
            return 0xdfB5f6CE42aAA7830E94ECFCcAd411beF4d4D5b6; // Holesky StrategyManager address
        }
        revert("Unsupported network");
    }

    function getBrevisProof() internal view returns (address) {
        if (block.chainid == 1) {
            return address(0); // Mainnet address
        } else if (block.chainid == 17000) {
            return 0x728b3C4C8b88AD54B8118D4c6a65fAC35e4CAb6B; // Holesky Brevis Proof address
        }
        revert("Unsupported network");
    }

    function getBrevisRequest() internal view returns (address) {
        if (block.chainid == 1) {
            return address(0); // Mainnet address
        } else if (block.chainid == 17000) {
            return 0xCE17B03d7901173Cbfa017B1ae3A9b8632f42c18; // Holesky Brevis Request address
        }
        revert("Unsupported network");
    }

    function getDelegationManager() internal view returns (address) {
        if (block.chainid == 1) {
            return address(0); // Mainnet address
        } else if (block.chainid == 17000) {
            return 0xA44151489861Fe9e3055d95adC98FbD462B948e7; // Holesky Delegation Manager address
        }
        revert("Unsupported network");
    }
} 