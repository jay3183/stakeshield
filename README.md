

# StakeShield

A Uniswap v4hook for interacting with EigenLayer's Protected AVS contracts on Holesky testnet.

## Overview
This hook provides a simple interface for interacting with EigenLayer's Protected AVS contracts, including operator registration and WETH staking functionality.

## Features
- Register as an operator
- Stake WETH
- View operator stats and stake history
- Real-time updates for operator registration events
- Error handling for contract interactions

## Installation

1. Install dependencies:

```bash
yarn install
```

2. Set up environment:

```bash
cp .env.example .env
# Fill in required values
```

3. Start all services:

```bash
chmod +x scripts/start.sh
./scripts/start.sh
```

## Deployment

### Local Testing

```bash
forge script script/Deploy.local.s.sol
```

### Testnet (Sepolia)

```bash
forge script script/EigenProtectedAVSHook.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify
```

### Mainnet

```bash
forge script script/deploy/DeployMainnet.s.sol --rpc-url $MAINNET_RPC_URL --broadcast --verify
```
