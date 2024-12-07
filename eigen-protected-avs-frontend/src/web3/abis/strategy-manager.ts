export const StrategyManagerABI = [
    {
      inputs: [
        { name: 'strategy', type: 'address' },
        { name: 'token', type: 'address' },
        { name: 'amount', type: 'uint256' }
      ],
      name: 'depositIntoStrategy',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    }
  ] as const