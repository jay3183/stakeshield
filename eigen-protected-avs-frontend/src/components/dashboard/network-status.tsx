'use client'

import { useAccount, useNetwork, useBlockNumber, usePublicClient } from 'wagmi'
import { useState, useEffect } from 'react'
import { formatEther } from 'viem'

export function NetworkStatus() {
  const { address } = useAccount()
  const { chain } = useNetwork()
  const { data: blockNumber } = useBlockNumber()
  const [isConnected, setIsConnected] = useState(false)
  const publicClient = usePublicClient()
  const [gasPrice, setGasPrice] = useState<bigint>(BigInt(0))

  useEffect(() => {
    setIsConnected(!!address)
  }, [address])

  useEffect(() => {
    if (chain) {
      publicClient.getGasPrice().then(setGasPrice)
    }
  }, [chain, publicClient])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Network Status</h2>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
          <span className="text-gray-600">Wallet Connection</span>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <span className="text-green-600 font-medium">Connected</span>
            ) : (
              <span className="text-red-600 font-medium">Not Connected</span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
          <span className="text-gray-600">Network</span>
          <div className="flex items-center gap-2">
            {chain ? (
              <div className="flex flex-col items-end">
                <span className="text-gray-900 font-medium">{chain.name}</span>
                <span className="text-sm text-gray-500">Chain ID: {chain.id}</span>
              </div>
            ) : (
              <span className="text-red-600 font-medium">Not Connected</span>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
          <span className="text-gray-600">Latest Block</span>
          <div className="flex items-center gap-2">
            {blockNumber ? (
              <div className="flex flex-col items-end">
                <span className="text-gray-900 font-medium">#{blockNumber.toString()}</span>
                <span className="text-sm text-gray-500">Live updating</span>
              </div>
            ) : (
              <span className="text-gray-500">Loading...</span>
            )}
          </div>
        </div>

        {chain && (
          <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200">
            <span className="text-gray-600">Gas Price</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-900 font-medium">
                {chain.nativeCurrency ? formatEther(gasPrice) : 'N/A'} {chain.nativeCurrency?.symbol}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 