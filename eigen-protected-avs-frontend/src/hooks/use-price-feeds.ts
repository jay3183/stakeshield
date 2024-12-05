import { usePublicClient } from 'wagmi'
import { contracts } from '@/web3/config'
import { chainlinkABI } from '@/web3/abis/chainlink'

export function usePriceFeeds() {
  const publicClient = usePublicClient()

  const getLatestPrice = async (priceFeedAddress: string) => {
    if (!publicClient) throw new Error('No provider available')
    return publicClient.readContract({
      address: priceFeedAddress as `0x${string}`,
      abi: chainlinkABI,
      functionName: 'latestRoundData'
    })
  }

  return {
    getLatestPrice
  }
} 