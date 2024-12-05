import { Request, Response } from 'express'
import { Providers } from '../types/index.js'

export class SyncController {
  constructor(private providers: Providers) {}

  getSyncEvents = async (req: Request, res: Response) => {
    try {
      const events = await this.providers.prisma.syncEvent.findMany({
        orderBy: { timestamp: 'desc' },
        take: 10
      })
      res.json(events)
    } catch (error) {
      console.error('Failed to get sync events:', error)
      res.status(500).json({ error: 'Failed to get sync events' })
    }
  }

  getSyncStats = async (req: Request, res: Response) => {
    try {
      const allEvents = await this.providers.prisma.syncEvent.findMany()
      const successfulEvents = allEvents.filter(e => e.status === 'success')
      
      const stats = {
        totalSyncs: allEvents.length,
        successRate: allEvents.length > 0 
          ? (successfulEvents.length / allEvents.length) * 100 
          : 0,
        avgLatency: successfulEvents.length > 0
          ? successfulEvents.reduce((acc, e) => acc + (e.latency || 0), 0) / successfulEvents.length
          : 0,
        nextScheduledSync: Date.now() + 900000 // 15 minutes from now
      }

      res.json(stats)
    } catch (error) {
      console.error('Failed to get sync stats:', error)
      res.status(500).json({ error: 'Failed to get sync stats' })
    }
  }

  triggerSync = async (req: Request, res: Response) => {
    try {
      const { stateData } = req.body
      const startTime = Date.now()

      // TODO: Add actual sync logic with contract
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate delay

      const event = await this.providers.prisma.syncEvent.create({
        data: {
          stateData,
          status: 'success',
          triggerSource: 'manual',
          latency: (Date.now() - startTime) / 1000
        }
      })

      res.json(event)
    } catch (error) {
      console.error('Failed to trigger sync:', error)
      res.status(500).json({ error: 'Failed to trigger sync' })
    }
  }

  toggleAutoSync = async (req: Request, res: Response) => {
    try {
      const { enabled } = req.body
      // TODO: Implement auto-sync toggle logic
      res.json({ autoSyncEnabled: enabled })
    } catch (error) {
      console.error('Failed to toggle auto sync:', error)
      res.status(500).json({ error: 'Failed to toggle auto sync' })
    }
  }
} 