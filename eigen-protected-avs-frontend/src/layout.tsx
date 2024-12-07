'use client'

import '@rainbow-me/rainbowkit/styles.css'
import '@/app/globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Providers } from '@/components/Providers'
import { MainLayout } from '@/components/Layout/main-layout'

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <Providers>{children}</Providers>
        </QueryClientProvider>
      </body>
    </html>
  )
}