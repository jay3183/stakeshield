import { contracts } from '@/web3/config'
import { BrevisProofABI } from '../abis/brevis.proof'
import { createPublicClient, http } from 'viem'
import { holesky } from 'viem/chains'

interface ProofInput {
  operatorAddress: string
  publicKey: string
}

interface BrevisProof {
  proof: string
  publicInputs: string[]
}

export async function generateBrevisProof({ operatorAddress, publicKey }: ProofInput): Promise<BrevisProof> {
  const publicClient = createPublicClient({
    chain: holesky,
    transport: http()
  })

  const proof = await publicClient.readContract({
    address: contracts.brevis.proof,
    abi: BrevisProofABI,
    functionName: 'getProofData',
    args: [operatorAddress as `0x${string}`]
  })

  return {
    proof: proof.smtRoot,
    publicInputs: [proof.commitHash, proof.vkHash, proof.appCommitHash, proof.appVkHash]
  }
}