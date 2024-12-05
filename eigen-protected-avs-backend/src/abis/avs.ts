export const avsABI = [
  {
    type: 'event',
    name: 'OperatorRegistered',
    inputs: [{ type: 'address', name: 'operator', indexed: true }]
  },
  {
    type: 'event',
    name: 'OperatorRemoved',
    inputs: [{ type: 'address', name: 'operator', indexed: true }]
  },
  {
    type: 'event',
    name: 'StakeUpdated',
    inputs: [
      { type: 'address', name: 'operator', indexed: true },
      { type: 'uint256', name: 'amount', indexed: false }
    ]
  }
] as const 