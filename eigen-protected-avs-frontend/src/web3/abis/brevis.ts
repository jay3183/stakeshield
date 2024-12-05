export const brevisABI = [
  {
    inputs: [{ name: 'proof', type: 'string' }],
    name: 'verifyFraudProof',
    outputs: [{ name: 'isValid', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const 

export const brevisProofABI = [
  {
    inputs: [{ name: 'operator', type: 'address' }],
    name: 'hasProof',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { name: 'chainId', type: 'uint64' },
      { name: 'proofWithPubInputs', type: 'bytes' },
      { name: 'withAppProof', type: 'bool' }
    ],
    name: 'submitProof',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;

export const brevisRequestABI = [
  {
    inputs: [
      { name: 'requestId', type: 'bytes32' },
      { name: 'refundee', type: 'address' },
      { name: 'callback', type: 'address' }
    ],
    name: 'sendRequest',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  }
] as const; 