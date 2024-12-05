export const HOLESKY_CONTRACTS = {
  poolManager: '0x1234...',
  avs: '0x5678...',
  avsHook: '0x9ABC...',
  brevisProof: '0xDEF0...',
  fraudVerifier: '0xABCD...'
} as const 

export type ContractAddresses = typeof HOLESKY_CONTRACTS 