'use client'

import { useState } from 'react'
import { usePublicClient, useWalletClient } from 'wagmi'
import { HOLESKY_CONTRACTS } from '@/config/contracts'
import { fraudVerifierABI } from '@/web3/abis/fraud-verifier'
import { toast } from 'sonner'

export function useFraudVerifier() {
  const [isVerifying, setIsVerifying] = useState(false)
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const verifyProof = async (proofId: string, operator: string, data: string) => {
    if (!publicClient || !walletClient) return

    setIsVerifying(true)
    try {
      const { request } = await publicClient.simulateContract({
        address: HOLESKY_CONTRACTS.fraudVerifier,
        abi: fraudVerifierABI,
        functionName: 'verifyFraudProof',
        args: [proofId as `0x${string}`, operator as `0x${string}`, data as `0x${string}`]
      })

      const hash = await walletClient.writeContract(request)
      
      toast.success('Fraud proof verification submitted')
      
      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      
      if (receipt.status === 'success') {
        toast.success('Fraud proof verified successfully')
      } else {
        toast.error('Fraud proof verification failed')
      }

      return receipt
    } catch (error) {
      console.error('Error verifying fraud proof:', error)
      toast.error('Failed to verify fraud proof')
    } finally {
      setIsVerifying(false)
    }
  }

  return {
    verifyProof,
    isVerifying
  }
} 