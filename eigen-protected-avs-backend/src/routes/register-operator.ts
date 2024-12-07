import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { OperatorService } from '../services/operatorService'

const router = Router()
const operatorService = new OperatorService()

// ... existing route handlers ...

export default router
