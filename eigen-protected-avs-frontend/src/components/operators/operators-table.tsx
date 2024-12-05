'use client'

import { useState, useEffect } from 'react'
import { useAVSContract } from '@/hooks/use-avs-contract'
import { formatEther, parseEther } from 'viem'
import { useAccount } from 'wagmi'
import { Notification } from '../ui/notification'
import { useTransactionStatus } from '@/hooks/use-transaction-status'
import { TransactionStatus } from '../ui/transaction-status'
import { logger } from '@/utils/logger'
import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'
import { avsABI } from '@/web3/abis/avs'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const DEBUG = true

function debugLog(...args: any[]) {
  if (DEBUG) {
    console.log('[DEBUG]', ...args)
  }
}

declare global {
  interface Window {
    ethereum?: any
  }
}

async function testContractConnection() {
  try {
    debugLog('Starting contract connection test')
    
    const ethereum = window.ethereum
    if (!ethereum) {
      debugLog('No wallet detected')
      return { success: false, error: 'No wallet detected' }
    }

    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http()
    })

    debugLog('Created public client')
    
    const contractAddress = '0x59DD66eD2a3C747958E53E6124845eC864CDac4F'
    
    // Try to read contract state
    const code = await publicClient.getBytecode({
      address: contractAddress
    })

    debugLog('Contract bytecode check:', { exists: !!code })

    if (!code) {
      return { success: false, error: 'Contract not found at address' }
    }

    // Try to read a view function
    try {
      const data = await publicClient.readContract({
        address: contractAddress,
        abi: avsABI,
        functionName: 'calculateDynamicFee'
      })
      debugLog('Contract read test:', data)
    } catch (error) {
      debugLog('Contract read failed:', error)
      return { success: false, error: 'Failed to read contract' }
    }
    
    return { success: true }
  } catch (error) {
    debugLog('Contract connection test failed:', error)
    return { success: false, error: String(error) }
  }
}

function logButtonClick(e: React.MouseEvent) {
  e.stopPropagation()
  debugLog('Button clicked - event:', e)
  return true
}

export function OperatorsTable() {
  logger.log('OperatorsTable rendering')

  const { address } = useAccount()
  const { operatorData, slashOperator, setOperatorStake, isLoading, error } = useAVSContract()
  const { trackTransaction, ...txStatus } = useTransactionStatus()
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
  } | null>(null)

  console.log('Component state:', {
    address,
    operatorData,
    isLoading,
    error
  })

  const [newStake, setNewStake] = useState('')
  const [operatorAddress, setOperatorAddress] = useState('')
  const [isOwnerState, setIsOwnerState] = useState(false)

  useEffect(() => {
    console.log('Address changed:', address)
    if (address) {
      const isOwner = address.toLowerCase() === "0xfb7C3BC613C1C50E6D6fEDb917b8741D97E5f1CB".toLowerCase()
      console.log('Owner check:', { address, isOwner })
      setIsOwnerState(isOwner)
    }
  }, [address])

  async function handleSetStake(operatorAddress: string) {
    try {
      logger.log('handleSetStake called with:', {
        operatorAddress,
        newStake,
        address,
        isLoading,
        isOwnerState,
        contractInfo: {
          setOperatorStake: !!setOperatorStake,
          hasAddress: !!address,
          hasOperatorData: !!operatorData
        }
      })

      if (!address) throw new Error('Wallet not connected')
      if (!operatorAddress) throw new Error('Operator address is required')
      if (!operatorAddress.startsWith('0x')) throw new Error('Invalid operator address format')
      if (!newStake || Number(newStake) <= 0) throw new Error('Invalid stake amount')

      logger.log('Validation passed, preparing to stake:', {
        operator: operatorAddress,
        amount: newStake,
        sender: address
      })

      const stakeAmount = parseEther(newStake)
      logger.log('Parsed stake amount:', stakeAmount.toString())

      if (!setOperatorStake) {
        throw new Error('Contract method not available')
      }

      const result = await setOperatorStake(
        operatorAddress as `0x${string}`,
        stakeAmount
      )

      logger.log('Stake result:', result)

      if (result && 'hash' in result) {
        logger.log('Transaction hash:', result.hash)
        trackTransaction(result.hash)
        setNotification({
          message: `Setting stake of ${newStake} ETH...`,
          type: 'info'
        })
      } else {
        logger.error('No transaction hash in result:', result)
        throw new Error('Failed to get transaction hash')
      }
    } catch (error) {
      logger.error('Full stake error:', error)
      setNotification({
        message: error instanceof Error ? error.message : 'Failed to set stake',
        type: 'error'
      })
    }
  }

  function testClick() {
    console.log('Test function called')
    alert('Test function works!')
  }

  const handleClick = () => {
    logger.log('Direct click handler fired')
    alert('Button clicked')
  }

  useEffect(() => {
    logger.log('Component mounted with state:', {
      address,
      operatorData,
      isLoading,
      newStake,
      operatorAddress
    })
  }, [address, operatorData, isLoading, newStake, operatorAddress])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Set Operator Stake</h2>
        <ConnectButton />
      </div>

      {address ? (
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Operator Address
            </label>
            <input
              type="text"
              placeholder="Enter operator address (0x...)"
              value={operatorAddress}
              onChange={(e) => {
                debugLog('Address input changed:', e.target.value)
                setOperatorAddress(e.target.value)
              }}
              className="w-full px-4 py-2 border rounded-md"
              pattern="^0x[a-fA-F0-9]{40}$"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stake Amount (ETH)
            </label>
            <input
              type="number"
              placeholder="Enter stake amount"
              value={newStake}
              onChange={(e) => {
                debugLog('Stake input changed:', e.target.value)
                setNewStake(e.target.value)
              }}
              className="w-full px-4 py-2 border rounded-md"
              required
              min="0"
              step="0.01"
            />
          </div>

          <button
            type="button"
            onClick={(e) => {
              debugLog('Stake button clicked')
              handleSetStake(operatorAddress)
            }}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            disabled={isLoading || !operatorAddress || !newStake}
          >
            {isLoading ? 'Setting Stake...' : 'Set Stake'}
          </button>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-600 dark:text-gray-300">
            Please connect your wallet to set operator stake
          </p>
        </div>
      )}

      {/* Debug Info */}
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <pre className="whitespace-pre-wrap text-sm">
          {JSON.stringify({
            address,
            operatorAddress: operatorAddress || 'Not set',
            stakeAmount: newStake || 'Not set',
            isLoading,
            isButtonDisabled: isLoading || !operatorAddress || !newStake,
            isWalletConnected: !!address
          }, null, 2)}
        </pre>
      </div>

      {/* Notifications */}
      {notification && (
        <Notification {...notification} onClose={() => setNotification(null)} />
      )}
      <TransactionStatus {...txStatus} />
    </div>
  )
} 