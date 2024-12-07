import { Router } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

router.get('/', async (req, res) => {
  try {
    console.log('Attempting to fetch operators...')
    const count = await prisma.operator.count()
    console.log('Operator count:', count)
    
    const operators = await prisma.operator.findMany({
      select: {
        id: true,
        address: true,
        stake: true,
        registeredAt: true,
        isFraud: true,
        fraudCount: true,
        lastUpdateAt: true,
        fraudEvents: true
      }
    })
    console.log('Fetched operators:', operators)
    
    // Convert BigInt to string before sending
    const sanitizedOperators = operators.map(op => ({
      ...op,
      stake: op.stake.toString()
    }))
    
    res.json(sanitizedOperators)
  } catch (error) {
    console.error('Detailed error:', error)
    res.status(500).json({ error: 'Failed to fetch operators' })
  }
})

export default router 