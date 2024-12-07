export const avsABI = [
  {
    inputs: [
      {
        components: [
          { name: '__deprecated_earningsReceiver', type: 'address' },
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
    inputs: [],
    name: 'setOperatorStake',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [{ name: 'operator', type: 'address' }],
    name: 'operators',
    outputs: [
      { name: 'stake', type: 'uint256' },
      { name: 'fraudCount', type: 'uint256' },
      { name: 'isRegistered', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const