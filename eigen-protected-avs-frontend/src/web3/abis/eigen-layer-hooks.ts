export const eigenLayerHooksABI = [
  {
    inputs: [
      {
        components: [
          { name: 'earningsReceiver', type: 'address' },
          { name: 'delegationApprover', type: 'address' },
          { name: 'stakerOptOutWindowBlocks', type: 'uint32' }
        ],
        name: 'operatorDetails',
        type: 'tuple'
      },
      { name: 'metadataURI', type: 'string' }
    ],
    name: 'registerOperatorWithHooks',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const 