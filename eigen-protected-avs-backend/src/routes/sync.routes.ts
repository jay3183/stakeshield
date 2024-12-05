import { Router } from 'express'
import { Providers } from '../types'
import { SyncController } from '../controllers/sync.controller'

export default function syncRoutes(providers: Providers) {
  const router = Router()
  const controller = new SyncController(providers)

  router.get('/', controller.getSyncEvents)
  router.get('/stats', controller.getSyncStats)
  router.post('/', controller.triggerSync)
  router.put('/auto', controller.toggleAutoSync)

  return router
} 