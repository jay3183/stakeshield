import { createPublicClient, webSocket, parseAbiItem } from 'viem'
import { prisma } from '../db'

export class BlockchainListener {
  constructor(private io: Server) {
    this.initializeListeners()
  }

  private async initializeListeners() {
    const client = createPublicClient({
      transport: webSocket(process.env.WS_RPC_URL)
    })

    // Listen for operator events
    client.watchEvent({
      address: process.env.CONTRACT_ADDRESS as `0x${string}`,
      event: parseAbiItem('event OperatorRegistered(address indexed operator)'),
      onLogs: async (logs) => {
        for (const log of logs) {
          const [operator] = log.args
          await this.handleOperatorRegistered(operator)
        }
      }
    })

    // Similar watchers for OperatorRemoved, StakeUpdated, FraudDetected
  }

  private async handleOperatorRegistered(operator: string) {
    // Update database
    await prisma.operator.upsert({
      where: { address: operator },
      create: { address: operator, status: 'REGISTERED' },
      update: { status: 'REGISTERED' }
    })

    // Notify connected clients
    this.io.emit('operator:updated', {
      type: 'REGISTERED',
      operator
    })
  }
} 