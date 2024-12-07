// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

interface IBrevisRequest {
    function submitRequest(
        bytes32 requestId,
        address operator,
        bytes calldata data
    ) external payable returns (bool);

    function getRequestStatus(bytes32 requestId) external view returns (
        bool isProcessed,
        bool isValid,
        string memory error
    );
} 