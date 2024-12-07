import { usePublicClient } from 'wagmi'
import { contracts } from '../config/config'
import { brevisABI } from '@/web3/abis/brevis'

export function useBrevis() {
  const publicClient = usePublicClient()

  const verifyFraudProof = async (proof: string) => {
    if (!publicClient) throw new Error('No provider available')
    return publicClient.readContract({
      address: contracts.brevis.address,
      abi: brevisABI,
      functionName: 'verifyFraudProof',
      args: [proof]
    })
  }

  return {
    verifyFraudProof
  }
} 