# Architecture

## Overview

The EigenProtectedAVSHook is a Uniswap v4 hook that integrates with EigenLayer for operator validation. It ensures that only registered and non-slashed operators can participate in pool operations.

## Components

1. **EigenProtectedAVSHook**: Main contract that implements Uniswap v4 hooks
2. **MockPoolManager**: Test implementation of Uniswap v4's IPoolManager
3. **MockEigenLayer**: Test implementation of EigenLayer's interfaces
4. **MockBrevis**: Test implementation of Brevis's proof verification

## Flow

1. Operator Registration
   - Operators register with EigenLayer
   - Operators stake ETH in the hook contract
   - Hook validates operator status with EigenLayer

2. Swap Flow
   - Before swap, hook checks operator status
   - If operator has fraud proof, swap is reverted
   - If operator is valid, swap proceeds

3. Slashing
   - Owner can slash operators with fraud proofs
   - Slashed operators cannot participate in swaps
   - Slashed stake is transferred to treasury 