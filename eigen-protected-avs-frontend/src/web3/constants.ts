export const HOLESKY_CONTRACTS = {
  eigenLayer: {
    delegationManager: '0xa44151489861fe9e3055d95adc98fbd462b948e7',
    strategyManager: '0xdfb5f6ce42aaa7830e94ecfccad411bef4d4d5b6',
    weth: '0x94373a4919b3240d86ea41593d5eba789fef3848',
    wethStrategy: '0x80528d6e9a2babfc766965e0e26d5ab08d9cfaf9'
  }
} as const;

export const CONTRACT_ADDRESSES = {
  EIGEN_PROTECTED_AVS: {
    11155111: '0xa44151489861fe9e3055d95adc98fbd462b948e7'  // Holesky testnet
  }
} as const; 