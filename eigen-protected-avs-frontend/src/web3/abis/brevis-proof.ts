export const brevisProofABI = [
  {
    inputs: [
      { name: 'proofId', type: 'bytes32' },
      { name: 'evidence', type: 'bytes' }
    ],
    name: 'verifyFraudProof',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const 