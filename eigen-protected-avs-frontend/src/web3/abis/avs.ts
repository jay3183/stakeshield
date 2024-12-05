export const avsABI = [
  {
    inputs: [{ name: 'operator', type: 'address' }],
    name: 'removeOperator',
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
    inputs: [],
    name: 'registerOperator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const