// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MockBrevis {
    bool private shouldReturnFraud;
    
    // Allow toggling the fraud detection result for testing
    function setShouldReturnFraud(bool _shouldReturnFraud) external {
        shouldReturnFraud = _shouldReturnFraud;
    }

    function verifyProof(bytes calldata) external view returns (bool) {
        return shouldReturnFraud;
    }
} 