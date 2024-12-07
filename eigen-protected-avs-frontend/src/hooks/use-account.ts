'use client'

import { useAccount as useWagmiAccount } from 'wagmi'

export const useAccount = () => {
  return useWagmiAccount()
} 