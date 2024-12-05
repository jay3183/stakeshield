import { usePublicClient, useAccount, useWriteContract } from 'wagmi'
import { contracts } from '@/web3/config'
import { eigenLayerABI } from '@/web3/abis/eigen-layer'

export function useEigenLayer() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()

  const getOperatorStatus = async (operatorAddress: string) => {
    if (!publicClient) throw new Error('No provider available')
    return publicClient.readContract({
      address: contracts.eigenLayer.address,
      abi: eigenLayerABI,
      functionName: 'getOperatorStatus',
      args: [operatorAddress as `0x${string}`]
    })
  }

  const getOperatorStake = async (operatorAddress: string) => {
    if (!publicClient) throw new Error('No provider available')
    return publicClient.readContract({
      address: contracts.eigenLayer.address,
      abi: eigenLayerABI,
      functionName: 'getOperatorStake',
      args: [operatorAddress as `0x${string}`]
    })
  }

  return {
    getOperatorStatus,
    getOperatorStake
  }
} 