'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Providers as Web3Providers } from '@/components/Providers'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Providers>{children}</Web3Providers>
    </QueryClientProvider>
  )
} 