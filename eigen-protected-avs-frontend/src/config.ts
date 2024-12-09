// Environment variable checks
if (!process.env.NEXT_PUBLIC_SYSTEM_CONFIG_ADDRESS) {
  throw new Error('Missing NEXT_PUBLIC_SYSTEM_CONFIG_ADDRESS')
}

if (!process.env.NEXT_PUBLIC_AVS_CONTRACT_ADDRESS) {
  throw new Error('Missing NEXT_PUBLIC_AVS_CONTRACT_ADDRESS')
}

if (!process.env.NEXT_PUBLIC_BREVIS_PROOF_ADDRESS) {
  throw new Error('Missing NEXT_PUBLIC_BREVIS_PROOF_ADDRESS')
}

if (!process.env.NEXT_PUBLIC_DELEGATION_MANAGER_ADDRESS) {
  throw new Error('Missing NEXT_PUBLIC_DELEGATION_MANAGER_ADDRESS')
}

if (!process.env.NEXT_PUBLIC_DELEGATION_TERMS_ADDRESS) {
  throw new Error('Missing NEXT_PUBLIC_DELEGATION_TERMS_ADDRESS')
}

// Contract addresses
export const SYSTEM_CONFIG_ADDRESS = process.env.NEXT_PUBLIC_SYSTEM_CONFIG_ADDRESS as `0x${string}`
export const AVS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_AVS_CONTRACT_ADDRESS as `0x${string}`
export const BREVIS_PROOF_ADDRESS = process.env.NEXT_PUBLIC_BREVIS_PROOF_ADDRESS as `0x${string}`
export const DELEGATION_MANAGER_ADDRESS = process.env.NEXT_PUBLIC_DELEGATION_MANAGER_ADDRESS as `0x${string}`
export const DELEGATION_TERMS_ADDRESS = process.env.NEXT_PUBLIC_DELEGATION_TERMS_ADDRESS as `0x${string}`

// Network configuration
export const HOLESKY = {
  id: 17000,
  name: 'Holesky',
  systemConfig: SYSTEM_CONFIG_ADDRESS,
  avsHook: AVS_CONTRACT_ADDRESS,
  brevisProof: BREVIS_PROOF_ADDRESS,
  delegationManager: DELEGATION_MANAGER_ADDRESS,
  delegationTerms: DELEGATION_TERMS_ADDRESS,
} as const