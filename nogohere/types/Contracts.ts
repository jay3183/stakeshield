export interface FraudEvent {
  operator: string
  proofId: string
  timestamp: number
  isValid: boolean
  details?: string
} 