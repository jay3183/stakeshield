import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { OperatorService } from '../services/operatorService'

const router = Router()
const operatorService = new OperatorService()

// Register new operator
router.post('/', async (req, res) => {
  try {
    const { address, stake } = req.body

    // Check if operator already exists
    const existingOperator = await prisma.operator.findUnique({
      where: { address }
    })

    if (existingOperator) {
      return res.status(400).json({ error: 'Operator already registered' })
    }

    // Verify operator eligibility via service
    const isEligible = await operatorService.isRegistered(address)
    if (!isEligible) {
      return res.status(400).json({ error: 'Operator not eligible for registration' })
    }

    // Create new operator
    const operator = await prisma.operator.create({
      data: {
        id: `op_${Date.now()}`,
        address,
        stake: BigInt(stake),
        isFraud: false,
        fraudCount: 0,
        registeredAt: new Date(),
        lastUpdateAt: new Date()
      }
    })

    res.status(201).json(operator)
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Failed to register operator' })
  }
})

// Update operator stake
router.put('/:address/stake', async (req, res) => {
  try {
    const { stake } = req.body
    const { address } = req.params

    const operator = await prisma.operator.update({
      where: { address },
      data: {
        stake: BigInt(stake),
        lastUpdateAt: new Date()
      }
    })

    res.json(operator)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stake' })
  }
})

// Get operator registration status
router.get('/:address/status', async (req, res) => {
  try {
    const operator = await prisma.operator.findUnique({
      where: { address: req.params.address },
      select: {
        id: true,
        address: true,
        stake: true,
        isFraud: true,
        fraudCount: true,
        registeredAt: true
      }
    })

    if (!operator) {
      return res.status(404).json({ error: 'Operator not found' })
    }

    res.json(operator)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch operator status' })
  }
})

export default router 