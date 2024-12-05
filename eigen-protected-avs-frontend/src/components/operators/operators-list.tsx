import { useContractRead, useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { avsABI } from '@/web3/abis/avs'
import { CONTRACT_ADDRESSES } from '@/web3/constants'

export function OperatorsList() {
  const { address } = useAccount()
  const { data: operatorData, isLoading } = useContractRead({
    address: CONTRACT_ADDRESSES.EIGEN_PROTECTED_AVS[11155111],
    abi: avsABI,
    functionName: 'operators',
    args: address ? [address] : undefined,
    enabled: !!address,
    watch: true
  })

  if (!address) return null
  if (isLoading) return <div>Loading operators...</div>

  const [stake, fraudCount, isRegistered] = operatorData ?? [0n, 0n, false]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Operator Status</h2>
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">{address.slice(0, 6)}...{address.slice(-4)}</p>
            <p className="text-sm text-gray-600">
              Stake: {formatEther(stake)} ETH
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded ${
              isRegistered 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {isRegistered ? 'Registered' : 'Not Registered'}
            </span>
            {fraudCount > 0 && (
              <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                Slashed: {fraudCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 