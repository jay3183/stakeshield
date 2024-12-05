'use client';

import { useAccount, usePublicClient } from 'wagmi';
import { avsABI } from '@/web3/abis/avs';
import { HOLESKY_CONTRACTS } from '@/config/contracts';
import { useReadContract, useWriteContract } from 'wagmi';
import { Hash, parseEther } from 'viem'
import { toast } from 'sonner'

export function useAVSContract() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync, isPending: isWritePending } = useWriteContract();

  // Read operator data
  const { data: operatorData, isLoading, refetch } = useReadContract({
    address: HOLESKY_CONTRACTS.avsHook,
    abi: avsABI,
    functionName: 'operators',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address
    }
  });

  // Register operator
  const registerOperator = async () => {
    if (!address) throw new Error('Wallet not connected');

    const hash = await writeContractAsync({
      address: HOLESKY_CONTRACTS.avsHook,
      abi: avsABI,
      functionName: 'registerOperator',
      args: []
    });

    return hash;
  };

  // Set stake
  const stake = async (amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    const value = parseEther(amount);
    const hash = await writeContractAsync({
      address: HOLESKY_CONTRACTS.avsHook,
      abi: avsABI,
      functionName: 'setOperatorStake',
      value
    });

    return hash;
  };

  // Remove operator
  const removeOperator = async (operatorAddress: string) => {
    if (!address) throw new Error('Wallet not connected');

    const hash = await writeContractAsync({
      address: HOLESKY_CONTRACTS.avsHook,
      abi: avsABI,
      functionName: 'removeOperator',
      args: [operatorAddress as `0x${string}`]
    });

    return hash;
  };

  return {
    operatorData,
    isLoading,
    registerOperator,
    removeOperator,
    stake,
    refetch,
    isRegistering: isWritePending,
    isStaking: isWritePending,
    isRemoving: isWritePending
  };
}
