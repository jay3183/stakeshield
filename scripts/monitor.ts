import { JsonRpcProvider, Contract } from 'ethers';
import { config } from 'dotenv';
import { sendDiscordAlert, sendTelegramAlert } from './alerts';
import { abi as ABI } from '../out/EigenProtectedAVSHook.sol/EigenProtectedAVSHook.json';

config();

const HOOK_ADDRESS = process.env.HOOK_ADDRESS;
const RPC_URL = process.env.SEPOLIA_RPC_URL;

async function monitorEvents() {
  const provider = new JsonRpcProvider(RPC_URL);
  const hook = new Contract(HOOK_ADDRESS, ABI, provider);

  hook.on('OperatorSlashed', async (operator, fraudCount) => {
    const message = `🚨 Operator ${operator} slashed! Fraud count: ${fraudCount}`;
    await Promise.all([
      sendDiscordAlert(message),
      sendTelegramAlert(message)
    ]);
  });

  // Monitor other events...
}

monitorEvents().catch(console.error); 