export const avsHookABI = [
  {
    inputs: [{ name: 'operator', type: 'address' }],
    name: 'registerOperator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'setOperatorStake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'operator', type: 'address' }],
    name: 'removeOperator',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'operator', type: 'address' },
      { indexed: false, name: 'stake', type: 'uint256' }
    ],
    name: 'OperatorRegistered',
    type: 'event'
  }
] as const 