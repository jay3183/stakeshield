'use client'

import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { usePublicClient } from 'wagmi'
import { HOLESKY_CONTRACTS } from '@/config/contracts'
import { avsABI } from '@/web3/abis/avs'
import { useNotifications } from './use-notifications'
import { Log } from 'viem'

interface OperatorUpdate {
  operator: string
  type: string
}

interface AVSEvent extends Log {
  eventName: string
}

export function useRealTimeEvents() {
  const publicClient = usePublicClient()
  const { addNotification } = useNotifications()

  useEffect(() => {
    if (!publicClient) return

    const socket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001')
    
    const unwatch = publicClient.watchContractEvent({
      address: HOLESKY_CONTRACTS.avsHook,
      abi: avsABI,
      onLogs: (logs: Log[]) => {
        for (const log of logs) {
          const event: AVSEvent = {
            ...log,
            eventName: log.topics[0] || '0x0000000000000000000000000000000000000000000000000000000000000000'
          }
          
          addNotification({
            type: 'info',
            message: `New event from AVS Hook: ${event.eventName || 'Unknown Event'}`
          })
        }
      }
    })

    socket.on('operator:updated', (data: OperatorUpdate) => {
      addNotification({
        type: 'info',
        message: `Operator ${data.operator.slice(0, 6)}...${data.operator.slice(-4)} ${data.type.toLowerCase()}`
      })
    })

    return () => {
      socket.disconnect()
      unwatch()
    }
  }, [publicClient, addNotification])
} 