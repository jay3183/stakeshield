import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'
import { avsABI } from '@/web3/abis/avs'
import { CONTRACT_ADDRESSES } from '@/web3/constants'

const client = createPublicClient({
  chain: sepolia,
  transport: http()
})

export async function GET(request: Request) {
  try {
    const operators = await client.readContract({
      address: CONTRACT_ADDRESSES.EIGEN_PROTECTED_AVS[11155111],
      abi: avsABI,
      functionName: 'operators',
      args: [request.url as `0x${string}`]
    })

    return Response.json({ operators })
  } catch (error) {
    console.error('Failed to fetch operators:', error)
    return Response.json({ error: 'Failed to fetch operators' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { address, stake } = await request.json()
    // Add contract interaction logic here
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Failed to add operator' }, { status: 500 })
  }
} 