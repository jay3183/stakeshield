import { RateLimiterMemory } from 'rate-limiter-flexible'

export class RateLimiter {
  private operatorLimiter: RateLimiterMemory
  private globalLimiter: RateLimiterMemory

  constructor() {
    // Limit per operator: 5 requests per minute
    this.operatorLimiter = new RateLimiterMemory({
      points: 5,
      duration: 60
    })

    // Global limit: 100 requests per minute
    this.globalLimiter = new RateLimiterMemory({
      points: 100,
      duration: 60
    })
  }

  async checkRateLimit(operatorAddress: string): Promise<boolean> {
    try {
      await Promise.all([
        this.operatorLimiter.consume(operatorAddress),
        this.globalLimiter.consume('global')
      ])
      return true
    } catch (error) {
      return false
    }
  }
} 