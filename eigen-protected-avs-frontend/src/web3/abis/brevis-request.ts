export const brevisRequestABI = [
  {
    inputs: [
      { name: 'requestId', type: 'bytes32' },
      { name: 'operator', type: 'address' },
      { name: 'caller', type: 'address' }
    ],
    name: 'sendRequest',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  }
] as const 