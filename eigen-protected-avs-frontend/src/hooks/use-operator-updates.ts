import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { useAVSContract } from './use-avs-contract'
import { usePublicClient } from 'wagmi'
import { contracts } from '@/config/contracts'
import { avsABI } from '@/web3/abis/avs'
import { parseAbiItem } from 'viem'

export function useOperatorUpdates() {
  const { refetch } = useAVSContract()
  const publicClient = usePublicClient()
  
  useEffect(() => {
    if (!publicClient) return

    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      path: '/socket.io/',
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      withCredentials: true,
      autoConnect: true,
      timeout: 10000
    })

    socket.io.on("error", (error) => {
      console.error("Socket connection error:", error)
    })
    
    // Direct blockchain events
    const unwatch = publicClient.watchEvent({
      address: contracts.avsHook.address,
      event: parseAbiItem('event OperatorRegistered(address indexed operator)'),
      onLogs: () => refetch()
    })
    
    socket.on('operator:updated', () => {
      refetch()
    })
    
    return () => {
      socket.disconnect()
      unwatch()
    }
  }, [refetch, publicClient])
} 