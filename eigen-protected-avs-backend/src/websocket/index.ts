export interface WebSocketEvents {
  'price:update': (data: any) => void
  'fraud:detected': (data: any) => void
  'sync:update': (data: any) => void
  'subscribe:prices': () => void
  'subscribe:fraud': () => void
  'subscribe:sync': () => void
  'subscribe:operator': (address: string) => void
}

export interface WebSocketEmitters {
  emitPriceUpdate: (data: any) => void
  emitFraudDetection: (data: any) => void
  emitSyncEvent: (data: any) => void
}

import { Server } from 'socket.io'
import { MonitoringService } from '../services/monitoring'
import { Providers } from '../types'

export function setupWebSocket(io: Server, providers: Providers) {
  const monitoring = new MonitoringService(providers, io)

  io.on('connection', (socket) => {
    console.log('Client connected')

    socket.on('subscribe:operator', (address: string) => {
      socket.join(`operator:${address}`)
    })

    socket.on('subscribe:prices', () => {
      socket.join('prices')
    })

    socket.on('disconnect', () => {
      console.log('Client disconnected')
    })
  })

  return io
} 