'use client'

import { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import { HOLESKY_CONTRACTS } from '@/config/contracts'
import { avsHookABI } from '@/web3/abis/avs-hook'
import type { Log } from 'viem'

export type AVSEvent = {
  id: string
  type: 'registration' | 'stake' | 'fraud' | 'removal'
  operator: string
  data: Record<string, any>
  timestamp: number
}

export function useAVSEvents() {
  const [events, setEvents] = useState<AVSEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const publicClient = usePublicClient()

  useEffect(() => {
    if (!publicClient) return

    const fetchEvents = async () => {
      try {
        const logs = await publicClient.getLogs({
          address: HOLESKY_CONTRACTS.eigenProtectedAVS.avsHook,
          events: avsHookABI,
          fromBlock: 'earliest'
        })

        const processedEvents = logs.map((log) => ({
          id: `${log.transactionHash}-${log.logIndex}`,
          type: (log as any).topics[0].toLowerCase() as AVSEvent['type'],
          operator: (log as any).topics[1],
          data: (log as any).data || {},
          timestamp: Number((log as any).timestamp)
        }))

        setEvents(processedEvents)
      } catch (error) {
        console.error('Error fetching AVS events:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [publicClient])

  return { events, isLoading }
} 