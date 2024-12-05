export const avsABI = [
  {
    inputs: [],
    name: 'getTotalOperators',
    outputs: [{ type: 'uint256', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalStaked',
    outputs: [{ type: 'uint256', name: '' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getOperators',
    outputs: [
      {
        components: [
          { name: 'address', type: 'address' },
          { name: 'stake', type: 'uint256' },
          { name: 'fraudCount', type: 'uint256' },
        ],
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ type: 'address', name: 'operator' }],
    name: 'registerOperator',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ type: 'address', name: 'operator' }],
    name: 'slashOperator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const 