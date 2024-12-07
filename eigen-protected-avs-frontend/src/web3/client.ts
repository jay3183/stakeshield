import 'dotenv/config'
import { createPublicClient, createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { holesky } from 'viem/chains'

console.log('Private key:', process.env.PRIVATE_KEY)
const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`

export const publicClient = createPublicClient({
  chain: holesky,
  transport: http()
});

export const walletClient = createWalletClient({
  chain: holesky,
  transport: http(),
  account: privateKeyToAccount(PRIVATE_KEY)
});