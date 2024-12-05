import { ethers } from 'ethers';
import { PrismaClient } from '@prisma/client';
import { EigenProtectedAVSHook } from '../types/contracts';

export enum RiskLevel {
    LOW = 'LOW_RISK',
    MEDIUM = 'MEDIUM_RISK',
    HIGH = 'HIGH_RISK',
    CRITICAL = 'CRITICAL'
}

export class FraudMonitorService {
    private readonly FRAUD_THRESHOLD = 2;
    private readonly HIGH_RISK_THRESHOLD = 3;

    constructor(
        private contract: EigenProtectedAVSHook,
        private db: PrismaClient
    ) {}

    async checkOperatorRisk(operator: string): Promise<RiskLevel> {
        const [fraudCount, verifications] = await Promise.all([
            this.db.operator.findUnique({
                where: { address: operator },
                select: { fraudCount: true }
            }),
            this.db.fraudProofVerification.findMany({
                where: {
                    operatorId: operator,
                    timestamp: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24h
                    }
                }
            })
        ]);

        if (!fraudCount) return RiskLevel.LOW;

        // Critical if fraud count exceeds threshold
        if (fraudCount.fraudCount >= this.FRAUD_THRESHOLD) {
            return RiskLevel.CRITICAL;
        }

        // High risk if multiple verification failures in 24h
        const failedVerifications = verifications.filter(v => !v.isValid);
        if (failedVerifications.length >= this.HIGH_RISK_THRESHOLD) {
            return RiskLevel.HIGH;
        }

        // Medium risk if any verification failures
        if (failedVerifications.length > 0) {
            return RiskLevel.MEDIUM;
        }

        return RiskLevel.LOW;
    }

    async monitorRisks() {
        // Monitor new verifications
        this.contract.on("FraudProofVerified", async (operator, proofId, isValid, error) => {
            const riskLevel = await this.checkOperatorRisk(operator);
            
            if (riskLevel === RiskLevel.CRITICAL) {
                // Emit critical risk alert
                console.error(`CRITICAL RISK: Operator ${operator} has exceeded fraud threshold`);
            } else if (riskLevel === RiskLevel.HIGH) {
                // Emit high risk alert
                console.warn(`HIGH RISK: Operator ${operator} has multiple verification failures`);
            }
        });
    }
} 