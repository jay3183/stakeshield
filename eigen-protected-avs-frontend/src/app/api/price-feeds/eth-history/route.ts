import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'

const client = createPublicClient({
  chain: sepolia,
  transport: http()
})

// Generate mock historical data based on current price
export async function GET() {
  try {
    const currentPrice = await client.readContract({
      address: '0x694AA1769357215DE4FAC081bf1f309aDC325306',
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
      const timestamp = now - (23 - i) * 3600 // Hourly data points
      const randomVariation = basePrice * (0.98 + Math.random() * 0.04) // ±2% variation
      return {
        timestamp,
        price: Math.floor(randomVariation).toString()
      }
    })

    return Response.json({ prices: history })
  } catch (error) {
    console.error('Failed to generate ETH price history:', error)
    return Response.json({ error: 'Failed to generate price history' }, { status: 500 })
  }
} 