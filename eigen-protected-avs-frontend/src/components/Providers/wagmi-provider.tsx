'use client'

import { WagmiConfig } from 'wagmi'
import { config } from '@/lib/wagmi'
import { useEffect, useState } from 'react'

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
} 