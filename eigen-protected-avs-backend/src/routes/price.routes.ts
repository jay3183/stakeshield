import { Router } from 'express'
import { Providers } from '../types/index.js'
import { PriceController } from '../controllers/price.controller.js'

export default function priceRoutes(providers: Providers) {
  const router = Router()
  const controller = new PriceController(providers)

  router.post('/simulate-swap', controller.simulateSwap)

  return router
} 