import { http } from 'viem'
import { holesky } from 'wagmi/chains'

export const HOLESKY_CONTRACTS = {
  eigenLayer: {
    delegationManager: '0xa44151489861fe9e3055d95adc98fbd462b948e7' as `0x${string}`,
    strategyManager: '0xdfb5f6ce42aaa7830e94ecfccad411bef4d4d5b6' as `0x${string}`,
    hooks: '0x16a696881853d5c387f1cf020f3f3ef8d92ab382' as `0x${string}`
  },
  eigenProtectedAVS: {
    systemConfig: '0x614ea0A41aF0c5eF7F32E21CF563f31E69aA8fEb' as `0x${string}`,
    avsHook: '0xd42Eb7760E4db8DFcD5F67c0BE3DFDAA7bd76a7f' as `0x${string}`,
    brevisProof: '0x728b3c4c8b88ad54b8118d4c6a65fac35e4cab6b' as `0x${string}`
  }
} as const

// Log the entire HOLESKY_CONTRACTS object
console.log('HOLESKY_CONTRACTS:', HOLESKY_CONTRACTS);

export const chains = [holesky]
// Types
export type ContractAddresses = typeof HOLESKY_CONTRACTS

