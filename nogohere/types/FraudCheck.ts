export interface FraudProof {
  proofId: string
  operator: string
  isValid: boolean
  timestamp: number
  details?: string
}

export interface FraudCheckResult {
  isValid: boolean
  error?: string
  timestamp: number
} 