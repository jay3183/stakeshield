'use client'

import { useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import { HOLESKY_CONTRACTS } from '@/config/contracts'
import { avsHookABI } from '@/web3/abis/avs-hook'
import { formatEther } from 'viem'

export type OperatorMetrics = {
  address: string
  stake: bigint
  fraudCount: number
  uptime: number
  performance: number
}

export type SystemMetrics = {
  totalOperators: number
  totalStake: bigint
  averageStake: bigint
  fraudRate: number
  activeOperators: number
  lastUpdateTime: number
}

export function useAVSMonitoring() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [operators, setOperators] = useState<OperatorMetrics[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const publicClient = usePublicClient()

  const fetchMetrics = async () => {
    if (!publicClient) return

    try {
      // Fetch all operators
      const operatorList = await fetch('/api/operators').then(res => res.json())
      
      // Calculate system metrics
      const totalStake = operatorList.reduce((acc: bigint, op: any) => acc + BigInt(op.stake), 0n)
      const activeOps = operatorList.filter((op: any) => BigInt(op.stake) > 0n)
      
      setMetrics({
        totalOperators: operatorList.length,
        totalStake,
        averageStake: operatorList.length ? totalStake / BigInt(operatorList.length) : 0n,
        fraudRate: operatorList.reduce((acc: number, op: any) => acc + op.fraudCount, 0) / operatorList.length,
        activeOperators: activeOps.length,
        lastUpdateTime: Date.now()
      })

      // Process operator metrics
      const operatorMetrics = operatorList.map((op: any) => ({
        address: op.address,
        stake: BigInt(op.stake),
        fraudCount: op.fraudCount,
        uptime: 100, // TODO: Calculate from events
        performance: 100 - (op.fraudCount * 10) // Simple performance metric
      }))

      setOperators(operatorMetrics)
    } catch (error) {
      console.error('Error fetching AVS metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000) // Update every 30s
    return () => clearInterval(interval)
  }, [publicClient])

  return {
    metrics,
    operators,
    isLoading,
    refetch: fetchMetrics
  }
} 