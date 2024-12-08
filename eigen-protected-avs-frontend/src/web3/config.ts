import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { createConfig } from 'wagmi'
import { holesky } from 'wagmi/chains'
import { createPublicClient, http } from 'viem'

const { connectors } = getDefaultWallets({
  appName: 'EigenProtected AVS',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
})

export const config = createConfig({
  connectors,
  chains: [holesky],
  transports: {
    [holesky.id]: http()
  }
})

export const chains = [holesky]

// Contract addresses
export const contracts = {
  eigenLayer: {
    delegationManager: '0xA44151489861Fe9e3055d95adC98FbD462B948e7' as `0x${string}`,
    strategyManager: '0xdfB5f6CE42aAA7830E94ECFCcAd411beF4d4D5b6' as `0x${string}`,
    weth: '0x94373a4919B3240D86eA41593D5aBb7Cb5085849' as `0x${string}`,
    wethStrategy: '0x80528D6e9A2BAbFc766965E0E26d5aB08D9CFaF9' as `0x${string}`,
    hooks: process.env.NEXT_PUBLIC_AVS_HOOK_ADDRESS as `0x${string}`,
    delegationTerms: '0x...' as `0x${string}`
  },
  brevis: {
    request: '0xce17b03d7901173cbfa017b1ae3a9b8632f42c18' as `0x${string}`,
    proof: '0x728b3c4c8b88ad54b8118d4c6a65fac35e4cab6b' as `0x${string}`
  }
} as const