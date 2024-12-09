import { useContractRead, useNetwork } from 'wagmi'
import { contracts } from '@/web3/config'

const SUPPORTED_CHAINS = {
  sepolia: 11155111,
  holesky: 17000,
  bscTestnet: 97
}

const BrevisProofABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "operator", "type": "address" },
      { "internalType": "bytes", "name": "data", "type": "bytes" }
    ],
    "name": "detectAnomalies",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export function useBrevisProof() {
  const { chain } = useNetwork()

  const checkForAnomalies = async (address: string, actionData: string) => {
    try {
      // Verify we're on a supported chain
      if (!chain || !Object.values(SUPPORTED_CHAINS).includes(chain.id)) {
        throw new Error('Unsupported chain for Brevis proof')
      }

      console.log('Calling Brevis contract:', {
        chain: chain.name,
        address,
        actionData,
        contractAddress: contracts.eigenLayer.brevisProof
      })

      const result = await useContractRead({
        address: contracts.eigenLayer.brevisProof,
        abi: BrevisProofABI,
        functionName: 'detectAnomalies',
        args: [address as `0x${string}`, `0x${actionData}`],
        chainId: chain.id
      })

      return {
        hasAnomalies: result || false,
        details: result ? 'Anomalies detected' : 'No anomalies found'
      }
    } catch (error) {
      console.error('Brevis check failed:', error)
      throw new Error('Failed to perform fraud check')
    }
  }

  return { checkForAnomalies }
} 