'use client'

import { createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { http } from 'viem'
import { injected } from 'wagmi/connectors'

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http()
  },
  connectors: [
    injected({
      target: 'phantom',
      shimDisconnect: true
    })
  ]
})

export const chains = [sepolia] as const

export const contracts = {
  avsHook: {
    address: '0x46d62538DCFf9d3900019879F4ed57F359804d80' as `0x${string}`,
    chainId: 11155111
  },
  eigenLayer: {
    address: '0x779D1B5730356c391F91cdF4C5319Af9B76f1432' as `0x${string}`, // Strategy Manager
    delegationManager: '0xA44151489861Fe9e3055d95adC98FbD462B948e7' as `0x${string}`,
    chainId: 11155111
  }
} as const