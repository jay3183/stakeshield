// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IBrevisRequest {
    /// @notice Request states
    enum RequestState {
        PENDING,
        PROCESSING,
        COMPLETED,
        FAILED
    }

    /// @notice Submits a new proof verification request
    /// @param data The proof data to verify
    /// @return requestId The ID of the submitted request
    function submitRequest(bytes calldata data) external returns (bytes32 requestId);

    /// @notice Gets the current state of a request
    /// @param requestId The ID of the request to check
    /// @return The request state
    function getRequestState(bytes32 requestId) external view returns (RequestState);
} 