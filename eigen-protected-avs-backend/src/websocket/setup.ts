import { Server } from 'socket.io'
import { createServer } from 'http'
import type { Express } from 'express'
import type { Providers } from '../types/index.js'
import { MonitoringService } from '../services/monitoring'

export function setupWebSocket(app: Express, providers: Providers) {
  const httpServer = createServer(app)
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)
    socket.on('subscribe:operator', (address: string) => socket.join(`operator:${address}`))
    socket.on('subscribe:fraud', () => socket.join('fraud'))
    socket.on('subscribe:sync', () => socket.join('sync'))
    socket.on('disconnect', () => console.log('Client disconnected:', socket.id))
  })

  const monitoring = new MonitoringService(providers, io)

  return { io, httpServer }
} 