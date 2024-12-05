import { JsonRpcProvider } from 'ethers';
import { config } from 'dotenv';

config();

async function checkPreDeployment() {
    const provider = new JsonRpcProvider(process.env.NETWORK_RPC_URL);
    
    // Check network
    const network = await provider.getNetwork();
    console.log('Network:', network.name);
    
    // Check deployer balance
    const deployer = process.env.DEPLOYER_ADDRESS;
    const balance = await provider.getBalance(deployer!);
    console.log('Deployer balance:', balance.toString());
    
    // Check required contracts
    const requiredContracts = [
        process.env.POOL_MANAGER,
        process.env.EIGEN_LAYER,
        process.env.BREVIS
    ];

    for (const contract of requiredContracts) {
        const code = await provider.getCode(contract!);
        if (code === '0x') {
            throw new Error(`Contract not deployed at ${contract}`);
        }
    }

    console.log('✅ Pre-deployment checks passed');
}

checkPreDeployment().catch(console.error); 