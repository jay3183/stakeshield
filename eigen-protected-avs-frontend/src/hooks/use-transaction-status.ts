'use client'

import { useState, useCallback } from 'react'
import { useTransaction } from 'wagmi'

export type TransactionStatus = 'pending' | 'success' | 'failed' | 'none';

export function useTransactionStatus() {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined)
  const { isLoading, isSuccess, isError } = useTransaction({
    hash,
    query: {
      enabled: !!hash
    }
  })

  const trackTransaction = useCallback((newHash: `0x${string}`) => {
    setHash(newHash)
  }, [])

  const resetStatus = useCallback(() => {
    setHash(undefined)
  }, [])

  return {
    isLoading,
    isSuccess,
    isError,
    trackTransaction,
    resetStatus,
    hash
  }
} 