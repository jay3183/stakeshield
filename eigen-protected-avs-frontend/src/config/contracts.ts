import { http } from 'viem'
import { holesky } from 'wagmi/chains'

export const HOLESKY_CONTRACTS = {
  eigenLayer: {
    delegationManager: '0xa44151489861fe9e3055d95adc98fbd462b948e7' as `0x${string}`,
    strategyManager: '0xdfb5f6ce42aaa7830e94ecfccad411bef4d4d5b6' as `0x${string}`,
    hooks: '0x16a696881853d5c387f1cf020f3f3ef8d92ab382' as `0x${string}`
  }
} as const

// Log the entire HOLESKY_CONTRACTS object
console.log('HOLESKY_CONTRACTS:', HOLESKY_CONTRACTS);

export const chains = [holesky]
// Types
export type ContractAddresses = typeof HOLESKY_CONTRACTS

