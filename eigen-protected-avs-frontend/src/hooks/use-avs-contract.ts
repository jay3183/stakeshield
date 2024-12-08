'use client'

console.log('Contract addresses:', contracts.eigenLayer)

import { useCallback, useState } from 'react'
import { useAccount, usePublicClient, useContractWrite, useContractRead, useWatchContractEvent, useWalletClient } from 'wagmi'
import { parseEther } from 'viem'
import { contracts } from '@/web3/config'
import { DelegationManagerABI } from '../web3/abis/delegation-manager'
import { StrategyManagerABI } from '../web3/abis/strategy-manager'
import { WETHABI } from '../web3/abis/weth'
import { useBrevis } from './use-brevis'

interface StakeDataPoint {
  timestamp: number
  value: number
}

export interface OperatorData {
  stake: bigint
  isRegistered: boolean
}

export function useAVSContract() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const [isLoading, setIsLoading] = useState(false)
  const [operatorData, setOperatorData] = useState<OperatorData | null>(null)
  const [totalStaked, setTotalStaked] = useState<bigint>(BigInt(0))
  const [operatorCount, setOperatorCount] = useState<number>(0)
  const { generateProof } = useBrevis()

  const { data: walletClient } = useWalletClient()

  const { data: registeredOperators, refetch: refetchOperators } = useContractRead({
    address: contracts.eigenLayer.delegationManager,
    abi: DelegationManagerABI,
    functionName: 'isOperator',
    args: [address ?? '0x0000000000000000000000000000000000000000' as `0x${string}`],
    query: {
      enabled: !!address
    }
  })

  useWatchContractEvent({
    address: contracts.eigenLayer.delegationManager,
    abi: DelegationManagerABI,
    eventName: 'OperatorRegistered',
    onLogs: () => {
      refetchOperators()
      updateOperatorStats()
    }
  })

  const updateOperatorStats = useCallback(async () => {
    if (!publicClient) return

    try {
      if (!address) return;

      const [totalStakedResult, operatorCountResult] = await Promise.all([
        publicClient.readContract({
          address: contracts.eigenLayer.delegationManager,
          abi: DelegationManagerABI,
          functionName: 'isOperator',
          args: [address as `0x${string}`]
        }),
        publicClient.readContract({
          address: contracts.eigenLayer.delegationManager,
          abi: DelegationManagerABI,
          functionName: 'isOperator',
          args: [address as `0x${string}`]
        })
      ])

      setTotalStaked(BigInt(0))
      setOperatorCount(totalStakedResult ? 1 : 0)
    } catch (error) {
      console.error('Failed to update operator stats:', error)
    }
  }, [publicClient])

  const registerAsOperator = useCallback(async (pubKey: string) => {
    if (!address) throw new Error('No address connected')
    console.log('Registering operator:', { address, pubKey })
    setIsLoading(true)

    try {
      const { proof, publicInputs } = await generateProof(address, pubKey)
      console.log('Generated proof:', { proof, publicInputs })

      if (!walletClient) throw new Error('No wallet connected')
      console.log('Wallet connected, sending transaction...')
      
      const hash = await walletClient.writeContract({
        address: contracts.eigenLayer.delegationManager,
        abi: DelegationManagerABI,
        functionName: 'registerAsOperator',
        args: [address, contracts.eigenLayer.delegationTerms]
      })
      console.log('Transaction sent:', hash)
      await updateOperatorStats()
      return hash
    } catch (error: any) {
      console.error('Registration failed:', error)
      throw new Error(error.message || 'Failed to register operator')
    } finally {
      setIsLoading(false)
    }
  }, [address, generateProof, walletClient, updateOperatorStats])

  const wrapETH = useContractWrite({
    ...WETHABI,
    functionName: 'deposit',
    address: contracts.eigenLayer.weth
  } as const)

  const approveWETH = useContractWrite({
    address: contracts.eigenLayer.weth,
    abi: WETHABI,
    functionName: 'approve'
  })

  const depositStrategy = useContractWrite({
    address: contracts.eigenLayer.strategyManager,
    abi: StrategyManagerABI,
    functionName: 'depositIntoStrategy'
  })

  const stakeWETH = useCallback(async (amount: string) => {
    if (!address) throw new Error('No address connected')
    setIsLoading(true)

    try {
      const stakeAmount = parseEther(amount)
      
      // 1. Wrap ETH
      const wrapTx = await wrapETH({ value: stakeAmount })
      await wrapTx.wait()

      // 2. Approve WETH
      const approveTx = await approveWETH({ 
        args: [contracts.eigenLayer.strategyManager, stakeAmount] 
      })
      await approveTx.wait()

      // 3. Stake WETH
      const stakeTx = await depositStrategy({ 
        args: [contracts.eigenLayer.wethStrategy, contracts.eigenLayer.weth, stakeAmount] 
      })
      await stakeTx.wait()
      
      await updateOperatorStats()
      return stakeTx.hash
    } catch (error: any) {
      console.error('Staking failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [address, wrapETH, approveWETH, depositStrategy, updateOperatorStats])

  const getStakeHistory = async () => {
    const history: StakeDataPoint[] = [
      { timestamp: Date.now() / 1000 - 86400 * 7, value: 100 },
      { timestamp: Date.now() / 1000 - 86400 * 6, value: 150 },
      { timestamp: Date.now() / 1000 - 86400 * 5, value: 200 },
      { timestamp: Date.now() / 1000 - 86400 * 4, value: 180 },
      { timestamp: Date.now() / 1000 - 86400 * 3, value: 250 },
      { timestamp: Date.now() / 1000 - 86400 * 2, value: 300 },
      { timestamp: Date.now() / 1000 - 86400, value: 280 }
    ]
    return history
  }

  return {
    registerAsOperator,
    stakeWETH,
    getStakeHistory,
    operatorData,
    totalStaked,
    operatorCount,
    isLoading,
    registeredOperators
  }
}