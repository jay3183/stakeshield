'use client'

import { createConfig, http } from 'wagmi'
import { mainnet, sepolia, holesky } from 'viem/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [holesky, mainnet, sepolia],
  transports: {
    [holesky.id]: http('https://ethereum-holesky.publicnode.com'),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    injected(),
  ],
})

// Export network-specific constants
export const CURRENT_CHAIN = holesky
export const IS_MAINNET = false