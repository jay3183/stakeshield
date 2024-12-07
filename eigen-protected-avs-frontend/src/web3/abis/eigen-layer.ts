export const eigenLayerABI = [
  {
    inputs: [
      {
        components: [
          { name: 'earningsReceiver', type: 'address' },
          { name: 'delegationApprover', type: 'address' },
          { name: 'stakerOptOutWindowBlocks', type: 'uint256' }
        ],
        name: 'registeringOperatorDetails',
        type: 'tuple'
      },
      { name: 'metadataURI', type: 'string' }
    ],
    name: 'registerAsOperator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'operator', type: 'address' }],
    name: 'isOperator',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const 