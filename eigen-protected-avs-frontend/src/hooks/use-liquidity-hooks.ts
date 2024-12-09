import { useContractWrite, useContractRead, useWaitForTransaction } from 'wagmi'
import { toast } from 'react-hot-toast'
import { contracts } from '@/web3/config'

const LiquidityHooksABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "pool", "type": "address" },
      { "internalType": "tuple", "name": "key", "type": "tuple" },
      { "internalType": "tuple", "name": "params", "type": "tuple" },
      { "internalType": "bytes", "name": "data", "type": "bytes" }
    ],
    "name": "beforeAddLiquidity",
    "outputs": [{ "internalType": "bytes4", "name": "", "type": "bytes4" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "pool", "type": "address" },
      { "internalType": "tuple", "name": "key", "type": "tuple" },
      { "internalType": "tuple", "name": "params", "type": "tuple" },
      { "internalType": "tuple", "name": "delta", "type": "tuple" },
      { "internalType": "bytes", "name": "data", "type": "bytes" }
    ],
    "name": "afterAddLiquidity",
    "outputs": [
      { "internalType": "bytes4", "name": "", "type": "bytes4" },
      { "internalType": "tuple", "name": "", "type": "tuple" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const

export function useLiquidityHooks() {
  const { write: addLiquidity, data: addLiquidityData } = useContractWrite({
    address: contracts.eigenLayer.avsContract,
    abi: LiquidityHooksABI,
    functionName: 'beforeAddLiquidity'
  })

  const addStake = async (amount: bigint) => {
    try {
      const tx = await addLiquidity({
        args: [
          contracts.eigenLayer.wethStrategy, // pool address
          [], // poolKey (empty for this example)
          { liquidityDelta: amount }, // params
          '0x' // data
        ]
      })

      useWaitForTransaction({
        hash: tx.hash,
        onSuccess(data) {
          toast.success('Successfully added stake!')
        },
        onError(error) {
          toast.error('Failed to add stake: ' + error.message)
        }
      })

    } catch (error: any) {
      toast.error('Failed to add stake: ' + error.message)
      throw error
    }
  }

  return { addStake }
} 