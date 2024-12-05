import { usePublicClient, useAccount, useWriteContract } from 'wagmi'
import { contracts } from '@/web3/config'
import { swapABI } from '@/web3/abis/swap'
import { Token } from '@/types/swap'
import { type Hash } from 'viem'

export function useSwapContract() {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  const { writeContractAsync } = useWriteContract()

  const getReserves = async (tokenA: Token, tokenB: Token) => {
    if (!publicClient) throw new Error('No provider available')
    if (!address) throw new Error('Wallet not connected')

    return publicClient.readContract({
      address: contracts.swap.address,
      abi: swapABI,
      functionName: 'getReserves',
      args: [tokenA.address as `0x${string}`, tokenB.address as `0x${string}`]
    })
  }

  const executeSwap = async (
    inputToken: Token,
    outputToken: Token,
    amountIn: bigint,
    amountOutMin: bigint
  ): Promise<Hash> => {
    try {
      if (!address) throw new Error('Wallet not connected')
      const result = await writeContractAsync({
        address: contracts.swap.address,
        abi: swapABI,
        functionName: 'swapExactTokensForTokens',
        args: [amountIn, amountOutMin, [inputToken.address, outputToken.address] as `0x${string}`[], address as `0x${string}`, BigInt(Date.now() + 1200000)]
      })
      return result
    } catch (error: any) {
      if (error.code === 4001) {
        throw new Error('Transaction rejected by user')
      }
      throw error
    }
  }

  return {
    getReserves,
    executeSwap
  }
} 