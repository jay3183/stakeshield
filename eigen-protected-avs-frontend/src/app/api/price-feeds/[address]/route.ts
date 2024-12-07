import { createPublicClient, http, isAddress } from 'viem'
import { sepolia } from 'viem/chains'
import { NextRequest } from 'next/server'

const client = createPublicClient({
  chain: sepolia,
  transport: http()
})

const CHAINLINK_ABI = [
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { name: "roundId", type: "uint80" },
      { name: "answer", type: "int256" },
      { name: "startedAt", type: "uint256" },
      { name: "updatedAt", type: "uint256" },
      { name: "answeredInRound", type: "uint80" }
    ],
    stateMutability: "view",
    type: "function"
  }
]

export async function GET(
  request: NextRequest,
  context: { params: { address: string } }
): Promise<Response> {
  const address = context.params.address

  if (!isAddress(address)) {
    return Response.json({ 
      error: 'Invalid address',
      success: false 
    }, { status: 400 })
  }

  try {
    const currentRound = await client.readContract({
      address: address as `0x${string}`,
      abi: CHAINLINK_ABI,
      functionName: 'latestRoundData'
    }) as [bigint, bigint, bigint, bigint, bigint]

    return Response.json({ 
      prices: [{
        timestamp: Number(currentRound[3]),
        price: currentRound[1].toString()
      }],
      success: true 
    })

  } catch (error) {
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch price',
      success: false 
    }, { status: 500 })
  }
}