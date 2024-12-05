// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

library Brevis {
    struct ExtractInfos {
        bytes32 commitHash;
        bytes32 vkHash;
        bytes32 appCommitHash;
        bytes32 appVkHash;
        bytes32 smtRoot;
    }
} 