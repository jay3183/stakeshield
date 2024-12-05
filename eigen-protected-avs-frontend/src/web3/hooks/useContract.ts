import { useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi'
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
    address: CONTRACT_ADDRESSES.EIGEN_PROTECTED_AVS[11155111],
    abi: EigenProtectedAVSABI,
    functionName: 'verifyProof',
    args: ['0x']
  })

  // Write functions
  const { 
    data: setFraudTx,
    isLoading: isSettingFraud,
    writeAsync: setShouldReturnFraud,
    error: setFraudError
  } = useContractWrite({
    address: CONTRACT_ADDRESSES.EIGEN_PROTECTED_AVS[11155111],
    abi: EigenProtectedAVSABI,
    functionName: 'setShouldReturnFraud'
  })

  // Wait for transaction
  const { 
    isLoading: isWaitingForTx,
    isSuccess: txSuccess
  } = useWaitForTransaction({
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