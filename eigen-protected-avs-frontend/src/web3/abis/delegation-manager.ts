export const DelegationManagerABI = [
  {
    inputs: [
      { name: 'earningsReceiver', type: 'address' },
      { name: 'delegationApprover', type: 'address' },
      { name: 'stakerOptOutWindowBlocks', type: 'uint256' }
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