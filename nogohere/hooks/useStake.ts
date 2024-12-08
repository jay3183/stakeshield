import { useState } from 'react'
import { useContractWrite } from 'wagmi'
import { contracts } from '@/web3/config'

export function useStake() {
  const [isStaking, setIsStaking] = useState(false)

  const stake = async (amount: string) => {
    // Staking logic
  }

  return {
    stake,
    isStaking
  }
}