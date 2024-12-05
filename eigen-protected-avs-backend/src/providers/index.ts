import { JsonRpcProvider } from 'ethers'
import { PrismaClient } from '@prisma/client'
import { Providers } from '../types/index.js'

export function initializeProviders(): Providers {
  const ethereum = new JsonRpcProvider(process.env.RPC_URL)
  const prisma = new PrismaClient()

  return {
    ethereum,
    prisma
  }
} 