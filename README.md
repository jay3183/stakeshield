## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```

# EigenProtectedAVSHook

A Uniswap v4 hook that integrates with EigenLayer for operator validation.

## Quick Start

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
