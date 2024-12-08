'use client'

import { usePublicClient, useWalletClient } from 'wagmi'
import { contracts } from '@/web3/config'
import { brevisRequestABI } from '@/web3/abis/brevis-request'
import { brevisProofABI } from '@/web3/abis/brevis-proof'
import { keccak256, encodeAbiParameters } from 'viem'

interface ProofData {
  commitHash: `0x${string}`
  vkHash: `0x${string}`
  appCommitHash: `0x${string}`
  appVkHash: `0x${string}`
  smtRoot: `0x${string}`
}

export function useBrevis() {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  
  const sendRequest = async (requestId: `0x${string}`, address: string) => {
    if (!walletClient) throw new Error('No wallet connected')
    return walletClient.writeContract({
      address: contracts.brevis.request,
      abi: brevisRequestABI,
      functionName: 'sendRequest',
      args: [requestId, address as `0x${string}`, address as `0x${string}`],
      value: BigInt(1e15) // 0.001 ETH fee
    })
  }

  const checkProofStatus = async (requestId: `0x${string}`, address: string) => {
    return publicClient?.readContract({
      address: contracts.brevis.proof,
      abi: brevisProofABI,
      functionName: 'verifyFraudProof',
      args: [requestId, address as `0x${string}`]
    })
  }

  const getProofData = async (requestId: `0x${string}`, address: string) => {
    return publicClient?.readContract({
      address: contracts.brevis.proof,
      abi: brevisProofABI,
      functionName: 'verifyFraudProof',
      args: [requestId, address as `0x${string}`]
    }) as unknown as Promise<ProofData>
  }

  const generateProof = async (address: string, pubKey: string) => {
    if (!publicClient) throw new Error('No provider available')

    try {
      // Generate requestId from address and pubKey
      const requestId = keccak256(
        encodeAbiParameters(
          [{ type: 'address' }, { type: 'string' }],
          [address as `0x${string}`, pubKey]
        )
      ) as `0x${string}`

      // Submit request with fee
      const hash = await sendRequest(requestId, address)
      await publicClient.waitForTransactionReceipt({ hash })

      // Poll for proof completion (timeout after 5 minutes)
      const startTime = Date.now()
      const TIMEOUT = 5 * 60 * 1000 // 5 minutes
      
      while (Date.now() - startTime < TIMEOUT) {
        const hasProof = await checkProofStatus(requestId, address)
        if (hasProof) {
          const proofData = await getProofData(requestId, address)
          return {
            proof: proofData.commitHash,
            publicInputs: [
              proofData.vkHash,
              proofData.appCommitHash,
              proofData.appVkHash,
              proofData.smtRoot
            ]
          }
        }
        await new Promise(r => setTimeout(r, 2000)) // Wait 2s between checks
      }

      throw new Error('Proof generation timed out')
    } catch (error: any) {
      console.error('Proof generation failed:', error)
      throw new Error(error.message || 'Failed to generate proof')
    }
  }

  const queryRequestStatus = async (requestId: `0x${string}`) => {
    if (!publicClient) throw new Error('No provider available')
    return publicClient.readContract({
      address: contracts.brevis.request,
      abi: brevisRequestABI,
      functionName: 'queryRequestStatus',
      args: [requestId]
    })
  }

  return {
    generateProof,
    queryRequestStatus,
    checkProofStatus,
    getProofData
  }
}