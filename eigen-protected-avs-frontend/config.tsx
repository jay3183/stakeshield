'use client'

import { createConfig } from 'wagmi'
import { mainnet, sepolia, holesky } from 'viem/chains'
import { createPublicClient, http } from 'viem'
import { InjectedConnector } from '@wagmi/core/connectors'

export const config = createConfig({
  connectors: [new InjectedConnector()],
  publicClient: createPublicClient({
    chain: holesky,
    transport: http()
  }),
})

// Export network-specific constants
export const CURRENT_CHAIN = holesky
export const IS_MAINNET = false