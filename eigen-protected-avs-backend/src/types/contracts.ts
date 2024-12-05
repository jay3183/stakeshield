import { BaseContract, ContractTransactionResponse, ContractEvent, ethers } from 'ethers';

export interface EigenProtectedAVSHook extends BaseContract {
    // View functions
    getOperatorStake: ethers.ContractMethod<[operator: string], bigint>;
    isRegisteredOperator: ethers.ContractMethod<[operator: string], boolean>;
    operatorStakes: ethers.ContractMethod<[operator: string], bigint>;
    registeredOperators: ethers.ContractMethod<[operator: string], boolean>;
    brevisProof: ethers.ContractMethod<[], string>;
    MINIMUM_STAKE: ethers.ContractMethod<[], bigint>;
    FRAUD_PENALTY: ethers.ContractMethod<[], bigint>;

    // State-changing functions
    registerOperator: ethers.ContractMethod<[], ContractTransactionResponse>;
    verifyFraudProof: ethers.ContractMethod<[operator: string, proofId: string, proofData: string], ContractTransactionResponse>;

    // Events
    filters: {
        OperatorRegistered: ContractEvent<[operator: string, stake: bigint]>;
        FraudProofVerified: ContractEvent<[operator: string, proofId: string, isValid: boolean, error: string]>;
    }
} 