export const EigenProtectedAVSABI = [
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "_shouldReturnFraud",
          "type": "bool"
        }
      ],
      "name": "setShouldReturnFraud",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "name": "verifyProof",
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