import { useEffect, useState } from 'react'
import { usePublicClient } from 'wagmi'
import type { Hash } from 'viem'

export type TransactionStatus = 'pending' | 'success' | 'failed' | 'none'

export function useTransactionStatus(hash?: Hash) {
  const [status, setStatus] = useState<TransactionStatus>('none')
  const [confirmations, setConfirmations] = useState(0)
  const publicClient = usePublicClient()

  useEffect(() => {
    if (!hash) return

    const checkStatus = async () => {
      try {
        const receipt = await publicClient.getTransactionReceipt({ hash })
        setStatus(receipt.status === 'success' ? 'success' : 'failed')
        setConfirmations(receipt.confirmations)
      } catch {
        setStatus('pending')
      }
    }

    const interval = setInterval(checkStatus, 3000)
    checkStatus()

    return () => clearInterval(interval)
  }, [hash, publicClient])

  return { status, confirmations }
} 