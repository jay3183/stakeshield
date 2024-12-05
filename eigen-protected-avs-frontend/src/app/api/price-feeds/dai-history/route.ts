import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'

const client = createPublicClient({
  chain: sepolia,
  transport: http()
})

export async function GET() {
  try {
    const currentPrice = await client.readContract({
      address: '0x14866185B1962B63C3Ea9E03Bc1da838b86E2867',
      abi: [{
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
      }],
      functionName: 'latestRoundData'
    })

    const basePrice = Number(currentPrice[1])
    const now = Math.floor(Date.now() / 1000)
    const history = Array.from({ length: 24 }, (_, i) => {
      const timestamp = now - (23 - i) * 3600
      const randomVariation = basePrice * (0.995 + Math.random() * 0.01) // ±0.5% variation for stablecoin
      return {
        timestamp,
        price: Math.floor(randomVariation).toString()
      }
    })

    return Response.json({ prices: history })
  } catch (error) {
    console.error('Failed to generate DAI price history:', error)
    return Response.json({ error: 'Failed to generate price history' }, { status: 500 })
  }
} 