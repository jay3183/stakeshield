import { Router, Request, Response, RequestHandler } from 'express'
import { Providers } from '../types'
import { OperatorController } from '../controllers/operator.controller'

export default function operatorRoutes(providers: Providers) {
  const router = Router()
  const controller = new OperatorController(providers)

  const handler = (fn: (req: Request, res: Response) => Promise<any>): RequestHandler => 
    (req, res, next) => Promise.resolve(fn(req, res)).catch(next)

  router.get('/', handler(controller.getAllOperators))
  router.get('/:address', handler(controller.getOperator))
  router.post('/add', handler(controller.addOperator))
  router.put('/:address/slash', handler(controller.slashOperator))
  router.post('/stake', handler(controller.setStake))

  return router
} 