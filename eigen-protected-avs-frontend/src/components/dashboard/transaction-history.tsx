'use client'

import { useEffect, useState } from 'react'
import { usePublicClient } from 'wagmi'
import { formatEther } from 'viem'
import { CONTRACT_ADDRESSES } from '@/web3/constants'

interface Transaction {
  hash: string
  blockNumber: number
  type: 'stake' | 'withdraw'
  amount: bigint
}

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const publicClient = usePublicClient()

  useEffect(() => {
    async function fetchTransactions() {
      try {
        // Fetch transactions logic here
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [publicClient])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No transactions found
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div
          key={tx.hash}
          className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <div className="flex flex-col">
            <span className="text-gray-900 font-medium">
              {tx.type === 'stake' ? 'Stake' : 'Withdraw'}
            </span>
            <a
              href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View on Etherscan
            </a>
          </div>
          <div className="text-right">
            <span className="text-gray-900 font-medium">
              {formatEther(tx.amount)} ETH
            </span>
            <div className="text-sm text-gray-500">
              Block #{tx.blockNumber}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 