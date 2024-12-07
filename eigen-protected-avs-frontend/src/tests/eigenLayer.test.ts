import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { holesky } from 'viem/chains';

// Import ABIs
const DelegationManagerABI = require('../abi/DelegationManager.json');
const StrategyManagerABI = require('../abi/StrategyManager.json');
const WETHABI = require('../abi/WETH.json');

// Contract addresses for Holesky testnet
const HOLESKY_CONTRACTS: {
  eigenLayer: {
    delegationManager: `0x${string}`;
    strategyManager: `0x${string}`;
    weth: `0x${string}`;
    wethStrategy: `0x${string}`;
  }
} = {
  eigenLayer: {
    delegationManager: '0xa44151489861fe9e3055d95adc98fbd462b948e7',
    strategyManager: '0xdfb5f6ce42aaa7830e94ecfccad411bef4d4d5b6',
    weth: '0x94373a4919b3240d86ea41593d5eba789fef3848',
    wethStrategy: '0x80528d6e9a2babfc766965e0e26d5ab08d9cfaf9'
  }
};

// Test private key - replace with your own test private key
const PRIVATE_KEY = '0x94356c5ed8be3a5b532945fc5de8ef889d38435c9449e350e701f740ea724e92';

async function testEigenLayerMiddleware() {
  try {
    // Create Viem clients
    const account = privateKeyToAccount(PRIVATE_KEY);
    console.log('Private key:', PRIVATE_KEY);

    const publicClient = createPublicClient({
      chain: holesky,
      transport: http()
    });

    const walletClient = createWalletClient({
      account,
      chain: holesky,
      transport: http()
    });

    console.log('HOLESKY_CONTRACTS:', HOLESKY_CONTRACTS);

    // Get the test address
    const testAddress = account.address;
    console.log('Test address:', testAddress);

    // Test 1: Check if address is an operator
    const isOperator = await publicClient.readContract({
      address: HOLESKY_CONTRACTS.eigenLayer.delegationManager,
      abi: DelegationManagerABI,
      functionName: 'isOperator',
      args: [testAddress as `0x${string}`],
    });
    console.log('Is Operator:', isOperator);

    if (!isOperator) {
      // Register as operator if not already registered
      const registerTx = await walletClient.writeContract({
        address: HOLESKY_CONTRACTS.eigenLayer.delegationManager,
        abi: DelegationManagerABI,
        functionName: 'registerAsOperator',
        args: [testAddress as `0x${string}`, "0x0000000000000000000000000000000000000000" as `0x${string}`],
      });
      console.log('Register as operator transaction sent. Hash:', registerTx);
    } else {
      console.log('Test address is already an operator.');
    }

    // Test 2: Get operator details
    const operatorDetails = await publicClient.readContract({
      address: HOLESKY_CONTRACTS.eigenLayer.delegationManager,
      abi: DelegationManagerABI,
      functionName: 'operatorDetails',
      args: [testAddress as `0x${string}`],
    });
    console.log('Operator Details:', operatorDetails);

    // Test 3: Wrap ETH to WETH and stake
    const stakeAmount = parseEther('0.03');
    console.log(`Wrapping ${stakeAmount} ETH to WETH...`);

    // Wrap ETH to WETH
    const wrapTx = await walletClient.writeContract({
      address: HOLESKY_CONTRACTS.eigenLayer.weth,
      abi: WETHABI.abi,
      functionName: 'deposit',
      args: [],
      value: stakeAmount,
      account,
    });
    console.log('Wrap ETH transaction sent. Hash:', wrapTx);

    // Wait for wrap transaction to be confirmed
    await publicClient.waitForTransactionReceipt({ hash: wrapTx });

    // Check WETH balance
    const wethBalance = await publicClient.readContract({
      address: HOLESKY_CONTRACTS.eigenLayer.weth,
      abi: WETHABI.abi,
      functionName: 'balanceOf',
      args: [testAddress as `0x${string}`],
    });
    console.log('WETH Balance:', wethBalance);

    // Approve WETH spending
    const approveTx = await walletClient.writeContract({
      address: HOLESKY_CONTRACTS.eigenLayer.weth,
      abi: WETHABI.abi,
      functionName: 'approve',
      args: [HOLESKY_CONTRACTS.eigenLayer.strategyManager, stakeAmount],
      account,
    });
    console.log('WETH approval transaction sent. Hash:', approveTx);

    // Wait for approval transaction to be confirmed
    await publicClient.waitForTransactionReceipt({ hash: approveTx });

    // Deposit into strategy
    const stakeTx = await walletClient.writeContract({
      address: HOLESKY_CONTRACTS.eigenLayer.strategyManager,
      abi: StrategyManagerABI.abi,
      functionName: 'depositIntoStrategy',
      args: [
        HOLESKY_CONTRACTS.eigenLayer.wethStrategy,
        HOLESKY_CONTRACTS.eigenLayer.weth,
        stakeAmount
      ],
      account,
    });

    console.log('Stake transaction sent. Hash:', stakeTx);

    // Wait for stake transaction to be confirmed
    const stakeReceipt = await publicClient.waitForTransactionReceipt({ hash: stakeTx });
    console.log('Stake transaction confirmed. Receipt:', stakeReceipt);

    // Re-Test Stake
    const stakeAfter = await publicClient.readContract({
      address: HOLESKY_CONTRACTS.eigenLayer.strategyManager,
      abi: StrategyManagerABI.abi,
      functionName: 'stakerStrategyShares',
      args: [testAddress as `0x${string}`, HOLESKY_CONTRACTS.eigenLayer.wethStrategy],
    });
    console.log('Operator Stake After Setting:', stakeAfter);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testEigenLayerMiddleware();