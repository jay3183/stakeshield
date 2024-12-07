'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Web3ClientProvider } from '@/components/providers/web3-client-provider'

const queryClient = new QueryClient()

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3ClientProvider>{children}</Web3ClientProvider>
    </QueryClientProvider>
  )
} 