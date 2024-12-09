'use client'

import { useCallback, useState, useEffect } from 'react'
import { useAccount, usePublicClient, useContractWrite, useContractRead, useContractEvent, useWalletClient, usePrepareContractWrite } from 'wagmi'
import { parseEther } from 'viem'
import { contracts } from '@/web3/config'
import { DelegationManagerABI } from '../web3/abis/delegation-manager'
import { StrategyManagerABI } from '../web3/abis/strategy-manager'
import { WETHABI } from '../web3/abis/weth'
import { useBrevis } from './use-brevis'


console.log('Contract addresses:', contracts.eigenLayer)

interface StakeDataPoint {
  timestamp: number
  value: number
}

export interface OperatorData {
  stake: bigint
  isRegistered: boolean
}

const AvsContractABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "operator", "type": "address" }
    ],
    "name": "isOperator",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "earningsReceiver", "type": "address" },
      { "internalType": "address", "name": "delegationApprover", "type": "address" },
      { "internalType": "uint256", "name": "stakerOptOutWindowBlocks", "type": "uint256" }
    ],
    "name": "registerAsOperator",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const

export function useAVSContract() {
  const delegationManagerAddress = contracts.eigenLayer.delegationManager
  const [isLoading, setIsLoading] = useState(false)
  const { address: account } = useAccount()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const { data: isOperator } = useContractRead({
    address: delegationManagerAddress as `0x${string}`,
    abi: AvsContractABI,
    functionName: 'isOperator',
    args: account ? [account as `0x${string}`] : undefined,
    enabled: !!account && isClient,
  })

  const config = account ? {
    address: delegationManagerAddress as `0x${string}`,
    abi: DelegationManagerABI,
    functionName: 'registerAsOperator',
    args: [
      account as `0x${string}`,
      "0x0000000000000000000000000000000000000000" as `0x${string}`,
      BigInt(50400)
    ],
    value: parseEther("0.05"),
    enabled: !isOperator && isClient,
  } : undefined;

  const { writeAsync } = useContractWrite({
    ...config,
    onError: (error: Error) => {
      console.error('Contract error:', error)
    }
  } as any);

  return {
    isLoading,
    isOperator,
    registerInAvs: async () => {
      if (!writeAsync) throw new Error('Contract write not ready')
      try {
        setIsLoading(true)
        const tx = await writeAsync()
        return tx
      } catch (error) {
        console.error('Contract error:', error)
        throw error
      } finally {
        setIsLoading(false)
      }
    }
  }
}