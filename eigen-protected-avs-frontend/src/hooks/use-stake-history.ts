'use client'

import { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import { HOLESKY_CONTRACTS } from '@/config/contracts'
import { avsABI } from '@/web3/abis/avs'
import { Log } from 'viem'

export interface StakeEvent {
  operator: string
  amount: bigint
  timestamp: number
  transactionHash: string
}

interface StakeUpdateArgs {
  operator: string
  amount: bigint
  timestamp?: bigint
}

export function useStakeHistory(operatorAddress?: string) {
  const [history, setHistory] = useState<StakeEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const publicClient = usePublicClient()

  useEffect(() => {
    async function fetchHistory() {
      if (!publicClient || !operatorAddress) return

      try {
        const logs = await publicClient.getContractEvents({
          address: HOLESKY_CONTRACTS.eigenLayer.hooks,
          abi: avsABI,
          eventName: 'StakeUpdated',
          fromBlock: 'earliest'
        })

        const events = logs
          .filter(log => {
            const args = log.args as unknown as StakeUpdateArgs
            return args.operator === operatorAddress
          })
          .map(log => {
            const args = log.args as unknown as StakeUpdateArgs
            return {
              operator: args.operator,
              amount: args.amount,
              timestamp: Number(args.timestamp || 0n),
              transactionHash: log.transactionHash || ''
            }
          })

        setHistory(events)
      } catch (error) {
        console.error('Failed to fetch stake history:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [publicClient, operatorAddress])

  return { history, isLoading }
} 