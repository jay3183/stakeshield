'use client'

import { Web3ClientProvider } from '@/components/providers/web3-client-provider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { useState, useEffect } from 'react'
import '@rainbow-me/rainbowkit/styles.css'
import './globals.css'
import { Toaster } from 'sonner'

const queryClient = new QueryClient()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <Web3ClientProvider>
            {mounted ? (
              <div className="flex h-screen bg-gray-100">
                <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900">
                  <Sidebar />
                </div>
                <div className="flex-1 flex flex-col md:pl-72">
                  <Header />
                  <main className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                  </main>
                </div>
              </div>
            ) : null}
          </Web3ClientProvider>
          <Toaster />
        </QueryClientProvider>
      </body>
    </html>
  )
}