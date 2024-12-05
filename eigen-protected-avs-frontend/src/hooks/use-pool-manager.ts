'use client'

import { useState } from 'react'
import { usePublicClient, useWalletClient } from 'wagmi'
import { HOLESKY_CONTRACTS } from '@/config/contracts'
import { poolManagerABI } from '@/web3/abis/pool-manager'
import { type Hash, parseEther, formatEther } from 'viem'
import { toast } from 'sonner'

export type PoolInfo = {
  liquidity: bigint
  sqrtPriceX96: bigint
  tick: number
  fee: number
}

export function usePoolManager() {
  const [isLoading, setIsLoading] = useState(false)
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const getPoolInfo = async (token0: string, token1: string, fee: number): Promise<PoolInfo | null> => {
    if (!publicClient) return null

    try {
      const data = await publicClient.readContract({
        address: HOLESKY_CONTRACTS.poolManager,
        abi: poolManagerABI,
        functionName: 'getPool',
        args: [token0 as `0x${string}`, token1 as `0x${string}`, fee]
      })

      return {
        liquidity: data.liquidity,
        sqrtPriceX96: data.sqrtPriceX96,
        tick: data.tick,
        fee: data.fee
      }
    } catch (error) {
      console.error('Error fetching pool info:', error)
      return null
    }
  }

  const modifyPosition = async (
    token0: string,
    token1: string,
    fee: number,
    tickLower: number,
    tickUpper: number,
    liquidityDelta: bigint
  ) => {
    if (!walletClient || !publicClient) return

    setIsLoading(true)
    try {
      const { request } = await publicClient.simulateContract({
        address: HOLESKY_CONTRACTS.poolManager,
        abi: poolManagerABI,
        functionName: 'modifyPosition',
        args: [{
          token0,
          token1,
          fee,
          tickLower,
          tickUpper,
          liquidityDelta
        }]
      })

      const hash = await walletClient.writeContract(request)
      
      toast.success('Position modification submitted')
      
      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      
      if (receipt.status === 'success') {
        toast.success('Position modified successfully')
      } else {
        toast.error('Position modification failed')
      }

      return receipt
    } catch (error) {
      console.error('Error modifying position:', error)
      toast.error('Failed to modify position')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    getPoolInfo,
    modifyPosition,
    isLoading
  }
} 