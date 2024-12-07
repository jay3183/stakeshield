import { Router } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

// Get all operators with their fraud events
router.get('/', async (req, res) => {
  try {
    const operators = await prisma.operator.findMany({
      include: {
        fraudEvents: true
      }
    })
    res.json(operators)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch operators' })
  }
})

// Get operator by address
router.get('/:address', async (req, res) => {
  try {
    const operator = await prisma.operator.findUnique({
      where: { address: req.params.address },
      include: {
        fraudEvents: true
      }
    })
    if (!operator) {
      return res.status(404).json({ error: 'Operator not found' })
    }
    res.json(operator)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch operator' })
  }
}) 