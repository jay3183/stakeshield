import { Request, Response } from 'express'
import { Providers } from '../types'

export class FraudController {
  constructor(private providers: Providers) {}

  getFraudEvents = async (req: Request, res: Response) => {
    try {
      const events = await this.providers.prisma.fraudDetection.findMany({
        orderBy: { timestamp: 'desc' },
        take: 10
      })
      res.json(events)
    } catch (error) {
      console.error('Failed to get fraud events:', error)
      res.status(500).json({ error: 'Failed to get fraud events' })
    }
  }

  getFraudStats = async (req: Request, res: Response) => {
    try {
      const allEvents = await this.providers.prisma.fraudDetection.findMany()
      
      const stats = {
        totalDetections: allEvents.length,
        confirmedFraud: allEvents.filter(e => e.status === 'confirmed').length,
        avgRiskScore: allEvents.length > 0
          ? allEvents.reduce((acc, e) => acc + e.riskScore, 0) / allEvents.length
          : 0,
        recentDetections: allEvents.filter(e => 
          e.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length
      }

      res.json(stats)
    } catch (error) {
      console.error('Failed to get fraud stats:', error)
      res.status(500).json({ error: 'Failed to get fraud stats' })
    }
  }

  detectFraud = async (req: Request, res: Response) => {
    try {
      const { traderAddress, transactionData } = req.body

      // TODO: Add actual fraud detection logic
      const riskScore = Math.random() // Mock risk score
      const isHighRisk = riskScore > 0.7

      const event = await this.providers.prisma.fraudDetection.create({
        data: {
          traderAddress,
          riskScore,
          status: isHighRisk ? 'detected' : 'resolved',
          details: isHighRisk 
            ? 'High risk transaction pattern detected'
            : 'Transaction appears normal'
        }
      })

      res.json(event)
    } catch (error) {
      console.error('Failed to detect fraud:', error)
      res.status(500).json({ error: 'Failed to detect fraud' })
    }
  }

  updateFraudStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { status } = req.body

      const event = await this.providers.prisma.fraudDetection.update({
        where: { id },
        data: { status }
      })

      res.json(event)
    } catch (error) {
      console.error('Failed to update fraud status:', error)
      res.status(500).json({ error: 'Failed to update fraud status' })
    }
  }
} 