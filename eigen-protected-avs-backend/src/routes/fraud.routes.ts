import { Router } from 'express'
import { Providers } from '../types'
import { FraudController } from '../controllers/fraud.controller'

export default function fraudRoutes(providers: Providers) {
  const router = Router()
  const controller = new FraudController(providers)

  router.get('/', controller.getFraudEvents)
  router.get('/stats', controller.getFraudStats)
  router.post('/detect', controller.detectFraud)
  router.put('/:id/status', controller.updateFraudStatus)

  return router
} 