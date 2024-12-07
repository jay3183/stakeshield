import { Router } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

router.post('/verify', async (req, res) => {
  // Implementation coming soon
  res.json({ message: 'Fraud check endpoint' })
})

export default router
