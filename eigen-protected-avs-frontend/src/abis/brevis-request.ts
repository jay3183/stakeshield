export const BrevisRequestABI = [
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_requestId",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "_refundee",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_callback",
        "type": "address"
      }
    ],
    "name": "sendRequest",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_requestId",
        "type": "bytes32"
      }
    ],
    "name": "queryRequestStatus",
    "outputs": [
      {
        "internalType": "enum BrevisRequest.RequestStatus",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const