import { JsonRpcProvider, Contract } from 'ethers';
import { config } from 'dotenv';
import { sendDiscordAlert, sendTelegramAlert } from '../alerts';
import { abi as ABI } from '../../out/EigenProtectedAVSHook.sol/EigenProtectedAVSHook.json';

config();

const HOOK_ADDRESS = process.env.HOOK_ADDRESS!;
const RPC_URL = process.env.SEPOLIA_RPC_URL!;

export class MonitoringService {
    private provider: JsonRpcProvider;
    private hook: Contract;

    constructor() {
        this.provider = new JsonRpcProvider(RPC_URL);
        this.hook = new Contract(HOOK_ADDRESS, ABI, this.provider);
    }

    async start() {
        console.log('Starting monitoring service...');
        
        this.hook.on('OperatorSlashed', this.handleSlash);
        this.hook.on('OperatorRegistered', this.handleRegistration);
        this.hook.on('StakeUpdated', this.handleStakeUpdate);
    }

    private async handleSlash(operator: string, fraudCount: number) {
        const message = ` Operator ${operator} slashed! Fraud count: ${fraudCount}`;
        await Promise.all([
            sendDiscordAlert(message),
            sendTelegramAlert(message)
        ]);
    }

    private async handleRegistration(operator: string) {
        const message = `✅ New operator registered: ${operator}`;
        await Promise.all([
            sendDiscordAlert(message),
            sendTelegramAlert(message)
        ]);
    }

    private async handleStakeUpdate(operator: string, newStake: bigint) {
        const message = `💰 Stake updated for ${operator}: ${newStake} ETH`;
        await Promise.all([
            sendDiscordAlert(message),
            sendTelegramAlert(message)
        ]);
    }
} 