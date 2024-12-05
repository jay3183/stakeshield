// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// Interfaces first
interface IProtocolFees { /* ... */ }
interface IERC6909Claims { /* ... */ }
interface IExtsload { /* ... */ }
interface IExttload { /* ... */ }
interface IPoolManager { /* ... */ }
interface IHooks { /* ... */ }

// Base contracts next
contract OperatorManager { /* ... */ }
contract UniswapHooks is OperatorManager, IHooks { /* ... */ }

// Finally our main contract
contract EigenProtectedAVSHook is UniswapHooks { /* ... */ }

