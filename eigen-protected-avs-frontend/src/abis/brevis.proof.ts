export const BrevisProofABI = [
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_requestId",
          "type": "bytes32"
        }
      ],
      "name": "getProofData",
      "outputs": [
        {
          "components": [
            {
              "internalType": "bytes32",
              "name": "commitHash",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "vkHash",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "appCommitHash",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "appVkHash",
              "type": "bytes32"
            },
            {
              "internalType": "bytes32",
              "name": "smtRoot",
              "type": "bytes32"
            }
          ],
          "internalType": "struct Brevis.ProofData",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
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
      "name": "hasProof",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ] as const