export const poolManagerABI = [
    {
      inputs: [
        { name: 'token0', type: 'address' },
        { name: 'token1', type: 'address' },
        { name: 'fee', type: 'uint24' }
      ],
      name: 'getPool',
      outputs: [
        {
          components: [
            { name: 'liquidity', type: 'uint128' },
            { name: 'sqrtPriceX96', type: 'uint160' },
            { name: 'tick', type: 'int24' },
            { name: 'fee', type: 'uint24' }
          ],
          type: 'tuple'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    }
  ] as const