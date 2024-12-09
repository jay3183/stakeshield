'use client'

import { useState } from 'react'
import { RainbowKitProvider, lightTheme, getDefaultWallets } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { mainnet, holesky } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  const { chains, publicClient } = configureChains(
    [mainnet, holesky],
    [publicProvider()]
  )

  const { connectors } = getDefaultWallets({
    appName: 'StakeShield',
    chains,
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!
  })

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
  })

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={chains} theme={lightTheme({
          accentColor: '#f97316',
          accentColorForeground: 'white',
          borderRadius: 'large',
          fontStack: 'system',
          overlayBlur: 'small'
        })} coolMode>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  )
}