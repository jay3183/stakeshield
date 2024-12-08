export const HOLESKY_CONTRACTS = {
  eigenLayer: {
    delegationManager: '0xa44151489861fe9e3055d95adc98fbd462b948e7',
    strategyManager: '0xdfb5f6ce42aaa7830e94ecfccad411bef4d4d5b6',
    weth: '0x94373a4919b3240d86ea41593d5eba789fef3848',
    wethStrategy: '0x80528d6e9a2babfc766965e0e26d5ab08d9cfaf9'
  },
  eigenProtectedAVS: {
    systemConfig: '0x5D649059cd5702B8e7277bcEDB687C19775BE57f',
    avsHook: '0x959f9BE9D5C1Dfbae42d9F6DaA84cfd319Da85Be',
    brevisProof: '0x728b3c4c8b88ad54b8118d4c6a65fac35e4cab6b'
  }
} as const;

export const CONTRACT_ADDRESSES = {
  EIGEN_PROTECTED_AVS: {
    17000: '0x959f9BE9D5C1Dfbae42d9F6DaA84cfd319Da85Be'  // Holesky testnet
  }
} as const; 