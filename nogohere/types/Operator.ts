export interface Operator {
  address: string
  stake: bigint
  isRegistered: boolean
  fraudCount: number
  lastUpdateTime: number
}

export interface OperatorUpdate {
  address: string
  type: 'REGISTERED' | 'SLASHED' | 'STAKE_UPDATED'
  timestamp: number
} 