export const avsABI = [
  {
    inputs: [
      { internalType: "contract IPoolManager", name: "_poolManager", type: "address" },
      { internalType: "address", name: "_brevisAddress", type: "address" },
      { internalType: "address", name: "_eigenLayerAddress", type: "address" }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "operators",
    outputs: [
      { internalType: "uint128", name: "stake", type: "uint128" },
      { internalType: "uint128", name: "fraudCount", type: "uint128" },
      { internalType: "bool", name: "isRegistered", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "registerOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "setOperatorStake",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [],
    name: "withdrawStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "operator", type: "address" }],
    name: "slashOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "removeOperator",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "operator", type: "address" }
    ],
    name: "OperatorRegistered",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "operator", type: "address" }
    ],
    name: "OperatorRemoved",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "operator", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "StakeUpdated",
    type: "event"
  }
] as const 