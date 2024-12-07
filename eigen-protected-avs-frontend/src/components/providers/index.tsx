'use client'

import { ThemeProvider } from '@/providers/theme-provider'
import { Web3Provider } from './web3-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Web3Provider>
          {children}
        </Web3Provider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
