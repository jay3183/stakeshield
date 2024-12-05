export const fraudVerifierABI = [
  {
    inputs: [
      { name: 'proofId', type: 'bytes32' },
      { name: 'operator', type: 'address' },
      { name: 'data', type: 'bytes' }
    ],
    name: 'verifyFraudProof',
    outputs: [{ name: 'isValid', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'proofId', type: 'bytes32' },
      { indexed: true, name: 'operator', type: 'address' },
      { indexed: false, name: 'isValid', type: 'bool' }
    ],
    name: 'FraudProofVerified',
    type: 'event'
  }
] as const 