'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { holesky } from 'wagmi/chains'
import { http } from 'viem'

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID

if (!walletConnectProjectId) {
  throw new Error('Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID')
}

export const contracts = {
  eigenLayer: {
    address: '0xdfB5f6CE42aAA7830E94ECFCcAd411beF4D4D5b6' as `0x${string}`, // Strategy Manager
    delegationManager: '0xA44151489861Fe9e3055d95adC98FbD462B948e7' as `0x${string}`,
    chainId: 17000 // Holesky chain ID
  },
  brevis: {
    request: '0xce17b03d7901173cbfa017b1ae3a9b8632f42c18' as `0x${string}`,
    proof: '0x728b3c4c8b88ad54b8118d4c6a65fac35e4cab6b' as `0x${string}`,
    chainId: 17000
  }
} as const

export const config = getDefaultConfig({
  appName: 'EigenProtected AVS',
  projectId: walletConnectProjectId,
  chains: [holesky],
  transports: {
    [holesky.id]: http()
  }
})

export const chains = [holesky]