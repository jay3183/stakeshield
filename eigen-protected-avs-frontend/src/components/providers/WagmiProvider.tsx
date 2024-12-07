'use client'

import { WagmiConfig } from 'wagmi'
import { config } from '@/lib/wagmi'
import { useEffect, useState } from 'react'

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <WagmiConfig config={config}>{children}</WagmiConfig>
} 