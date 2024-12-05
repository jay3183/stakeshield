import { ethers } from 'ethers';
import { PrismaClient } from '@prisma/client';
import { EigenProtectedAVSHook } from '../types/contracts';

export class MonitoringService {
    private contract: EigenProtectedAVSHook;
    private db: PrismaClient;

    constructor(
        contract: EigenProtectedAVSHook,
        db: PrismaClient
    ) {
        this.contract = contract;
        this.db = db;
    }

    async monitorOperators() {
        // Listen for operator events
        this.contract.on("OperatorRegistered", async (operator, stake) => {
            await this.db.operator.create({
                data: {
                    id: operator,
                    address: operator,
                    stake: stake.toString(),
                    fraudCount: 0,
                    updatedAt: new Date()
                }
            });
        });

        // Listen for fraud proof events
        this.contract.on("FraudProofVerified", async (operator, proofId, isValid, error) => {
            await this.db.fraudProofVerification.create({
                data: {
                    id: proofId,
                    proofId: proofId,
                    isValid,
                    verificationError: error || null,
                    operatorId: operator,
                    timestamp: new Date()
                }
            });

            if (!isValid) {
                await this.db.operator.update({
                    where: { id: operator },
                    data: {
                        fraudCount: { increment: 1 },
                        updatedAt: new Date()
                    }
                });
            }
        });
    }
} 


