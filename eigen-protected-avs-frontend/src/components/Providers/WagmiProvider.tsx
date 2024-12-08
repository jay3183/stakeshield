'use client'

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { createConfig, WagmiConfig } from 'wagmi'
import { holesky } from 'wagmi/chains'
import { http } from 'viem'

const { connectors } = getDefaultWallets({
  appName: 'EigenProtected AVS',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
})

const config = createConfig({
  chains: [holesky],
  connectors,
  transports: {
    [holesky.id]: http()
  }
})

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}