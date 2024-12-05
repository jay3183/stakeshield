'use client'

import { Spinner } from './spinner'

interface TransactionStatusProps {
  hash: `0x${string}` | undefined
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
}

export function TransactionStatus({ hash, isLoading, isSuccess, isError }: TransactionStatusProps) {
  if (!hash) return null

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg z-50">
      <div className="flex items-center space-x-3">
        {isLoading && <Spinner className="h-4 w-4" />}
        {isSuccess && <span className="text-green-500">✓</span>}
        {isError && <span className="text-red-500">✕</span>}
        <div>
          <p className="text-sm font-medium">
            {isLoading && 'Transaction Pending'}
            {isSuccess && 'Transaction Successful'}
            {isError && 'Transaction Failed'}
          </p>
          <a
            href={`https://etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:text-blue-600"
          >
            View on Etherscan
          </a>
        </div>
      </div>
    </div>
  )
} 