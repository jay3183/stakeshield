import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

// Initialize Prisma
prisma.$connect().catch((error) => {
  console.error('Failed to connect to database:', error)
  process.exit(1)
}) 