import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'
import { avsABI } from '../src/web3/abis/avs'
import { CONTRACT_ADDRESSES } from '../src/web3/constants'

async function verifyDeployment() {
  const client = createPublicClient({
    chain: sepolia,
    transport: http()
  })

  console.log('Verifying deployment...')

  // Check contract code
  const code = await client.getBytecode({
    address: CONTRACT_ADDRESSES.EIGEN_PROTECTED_AVS[11155111]
  })
  if (!code) throw new Error('Contract not deployed')

  // Check owner
  const owner = await client.readContract({
    address: CONTRACT_ADDRESSES.EIGEN_PROTECTED_AVS[11155111],
    abi: avsABI,
    functionName: 'owner'
  })
  console.log('Contract owner:', owner)

  // Check initialization
  const paused = await client.readContract({
    address: CONTRACT_ADDRESSES.EIGEN_PROTECTED_AVS[11155111],
    abi: avsABI,
    functionName: 'paused'
  })
  console.log('Contract paused:', paused)

  // More checks...
}

verifyDeployment().catch(console.error) 