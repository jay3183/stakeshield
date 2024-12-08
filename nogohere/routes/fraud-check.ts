import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { FraudDetectionService } from '../services/fraudDetectionService'

const router = Router()
const fraudDetectionService = new FraudDetectionService()

// Verify fraud proof
router.post('/verify', async (req, res) => {
  try {
    const { operatorAddress, proofId } = req.body

    // Get operator
    const operator = await prisma.operator.findUnique({
      where: { address: operatorAddress }
    })

    if (!operator) {
      return res.status(404).json({ error: 'Operator not found' })
    }

    // Verify proof using Brevis SDK
    const result = await fraudDetectionService.verifyProof(operatorAddress, proofId)

    // Log fraud event
    const fraudEvent = await prisma.fraudEvent.create({
      data: {
        id: `fe_${Date.now()}`,
        operatorId: operator.id,
        proofId,
        isValid: result.isValid,
        details: result.error || 'Proof verification completed'
      }
    })

    // Update operator if fraud detected
    if (!result.isValid) {
      await prisma.operator.update({
        where: { id: operator.id },
        data: {
          isFraud: true,
          fraudCount: { increment: 1 }
        }
      })
    }

    res.json({ result, fraudEvent })
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify fraud proof' })
  }
})

// Get fraud history for operator
router.get('/history/:address', async (req, res) => {
  try {
    const operator = await prisma.operator.findUnique({
      where: { address: req.params.address },
      include: {
        fraudEvents: {
          orderBy: { detectedAt: 'desc' }
        }
      }
    })

    if (!operator) {
      return res.status(404).json({ error: 'Operator not found' })
    }

    res.json(operator.fraudEvents)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fraud history' })
  }
})

export default router 