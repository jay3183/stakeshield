import { useContractRead, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { EigenProtectedAVSABI } from '../abis/EigenProtectedAVS'
import { CONTRACT_ADDRESSES } from '../constants'

export function useEigenProtectedAVS() {
  // Read functions
  const { 
    data: verifyProofResult,
    isLoading: isVerifyingProof,
    error: verifyProofError,
    refetch: refetchVerifyProof
  } = useContractRead({
    address: CONTRACT_ADDRESSES.EIGEN_PROTECTED_AVS[17000],
    abi: EigenProtectedAVSABI,
    functionName: 'verifyProof',
    args: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
    query: {
      enabled: false
    }
  })

  // Write functions
  const { 
    data: setFraudTx,
    isLoading: isSettingFraud,
    writeContract: setShouldReturnFraud,
    error: setFraudError
  } = useWriteContract()

  // Wait for transaction
  const { 
    isLoading: isWaitingForTx,
    isSuccess: txSuccess
  } = useWaitForTransactionReceipt({
    hash: setFraudTx
  })

  return {
    // Read functions
    verifyProofResult,
    isVerifyingProof,
    verifyProofError,
    refetchVerifyProof,

    // Write functions
    setShouldReturnFraud,
    isSettingFraud,
    isWaitingForTx,
    txSuccess,
    setFraudError
  }
}