import { Request, Response } from 'express'
import { Providers } from '../types'
import { Server } from 'socket.io'

export class OperatorController {
  constructor(
    private providers: Providers,
    private io: Server
  ) {}

  getAllOperators = async (req: Request, res: Response) => {
    try {
      const operators = await this.providers.prisma.operator.findMany()
      res.json(operators)
    } catch (error) {
      console.error('Failed to get operators:', error)
      res.status(500).json({ error: 'Failed to get operators' })
    }
  }

  getOperator = async (req: Request, res: Response) => {
    try {
      const { address } = req.params
      const operator = await this.providers.prisma.operator.findUnique({
        where: { address }
      })
      
      if (!operator) {
        return res.status(404).json({ error: 'Operator not found' })
      }

      res.json(operator)
    } catch (error) {
      console.error('Failed to get operator:', error)
      res.status(500).json({ error: 'Failed to get operator' })
    }
  }

  addOperator = async (req: Request, res: Response) => {
    try {
      const { address } = req.body
      
      const operator = await this.providers.prisma.operator.create({
        data: {
          address,
          status: 'ACTIVE',
          stake: BigInt(0),
          fraudCount: 0
        }
      })

      res.json(operator)
    } catch (error) {
      console.error('Failed to add operator:', error)
      res.status(500).json({ error: 'Failed to add operator' })
    }
  }

  setStake = async (req: Request, res: Response) => {
    try {
      const { operatorAddress, amount } = req.body
      
      // Verify operator exists
      const operator = await this.providers.prisma.operator.findUnique({
        where: { address: operatorAddress }
      })

      if (!operator) {
        return res.status(404).json({ error: 'Operator not found' })
      }

      // Update stake
      const updated = await this.providers.prisma.operator.update({
        where: { address: operatorAddress },
        data: { stake: amount }
      })

      res.json(updated)
    } catch (error) {
      console.error('Failed to set stake:', error)
      res.status(500).json({ error: 'Failed to set stake' })
    }
  }

  slashOperator = async (req: Request, res: Response) => {
    try {
      const operator = await this.providers.prisma.operator.update({
        where: { address: req.params.address },
        data: {
          stake: BigInt(0),
          fraudCount: { increment: 1 }
        }
      })
      res.json(operator)
    } catch (error) {
      res.status(500).json({ error: 'Failed to slash operator' })
    }
  }

  updateOperatorStake = async (req: Request, res: Response) => {
    try {
      const { address, stake } = req.body
      const operator = await this.providers.prisma.operator.upsert({
        where: { address },
        update: { stake: BigInt(stake) },
        create: {
          address,
          stake: BigInt(stake),
          status: 'ACTIVE'
        }
      })
      res.json(operator)
    } catch (error) {
      res.status(500).json({ error: 'Failed to update operator' })
    }
  }

  async updateOperator(req: Request, res: Response) {
    try {
      const { address, action } = req.body
      
      // Update database
      await this.providers.prisma.operator.upsert({
        where: { address },
        create: { address, lastAction: action, timestamp: new Date() },
        update: { lastAction: action, timestamp: new Date() }
      })

      // Emit update event
      this.io.emit('operator:updated', { address, action })
      
      res.json({ success: true })
    } catch (error) {
      res.status(500).json({ error: 'Failed to update operator' })
    }
  }
} 