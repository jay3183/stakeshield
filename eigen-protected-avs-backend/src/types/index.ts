import { ethers } from 'ethers'
import { PrismaClient } from '@prisma/client'

export interface Providers {
  ethereum: ethers.Provider,
  prisma: PrismaClient
}

export interface PriceFeed {
  token: string;
  price: number;
  timestamp: number;
} 