import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'

const client = createPublicClient({
  chain: sepolia,
  transport: http()
})

const CHAINLINK_DECIMALS = {
  '0x694AA1769357215DE4FAC081bf1f309aDC325306': 8, // ETH/USD
  '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43': 8, // BTC/USD
  '0xc59E3633BAAC79493d908e63626716e204A45EdF': 8, // LINK/USD
  '0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E': 8  // USDC/USD
}

export async function GET(
  request: NextRequest,
  { params }: { params: { address: string } }
) {
  try {
    const address = params.address

    // Validate address
    if (!address || !(address in CHAINLINK_DECIMALS)) {
      return NextResponse.json({ error: 'Invalid price feed address' }, { status: 400 })
    }

    const roundData = await client.readContract({
      address: address as `0x${string}`,
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

    // Validate response
    if (!roundData || !roundData[1] || !roundData[3]) {
      throw new Error('Invalid price feed response')
    }

    return NextResponse.json({
      price: roundData[1].toString(),
      timestamp: Number(roundData[3]),
      decimals: CHAINLINK_DECIMALS[address as keyof typeof CHAINLINK_DECIMALS]
    })
  } catch (error) {
    console.error('Failed to fetch price feed:', error)
    return NextResponse.json({ error: 'Failed to fetch price feed' }, { status: 500 })
  }
} 