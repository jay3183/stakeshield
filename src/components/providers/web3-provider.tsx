'use client'

import { WagmiConfig } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { config, chains } from '@/web3/config'
import { ErrorBoundaryWrapper } from '../error-boundary-wrapper'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundaryWrapper>
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={config}>
          <RainbowKitProvider>
            {children}
          </RainbowKitProvider>
        </WagmiConfig>
      </QueryClientProvider>
    </ErrorBoundaryWrapper>
  )
} 