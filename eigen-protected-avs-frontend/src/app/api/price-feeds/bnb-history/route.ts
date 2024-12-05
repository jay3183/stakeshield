import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'

const client = createPublicClient({
  chain: sepolia,
  transport: http()
})

export async function GET() {
  try {
    const currentPrice = await client.readContract({
      address: '0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526',
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
      const randomVariation = basePrice * (0.985 + Math.random() * 0.03) // ±1.5% variation
      return {
        timestamp,
        price: Math.floor(randomVariation).toString()
      }
    })

    return Response.json({ prices: history })
  } catch (error) {
    console.error('Failed to generate BNB price history:', error)
    return Response.json({ error: 'Failed to generate price history' }, { status: 500 })
  }
} 