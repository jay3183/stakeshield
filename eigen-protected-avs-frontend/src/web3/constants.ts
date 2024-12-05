// Chain IDs
export const SUPPORTED_CHAINS = {
    SEPOLIA: 11155111
  } as const
  
  // Contract addresses for different networks
  export const CONTRACT_ADDRESSES = {
    EIGEN_PROTECTED_AVS: {
      11155111: '0x369E10Bb2ECaCA0eF3e9C3B6194871Fb620E14E0'
    }
  } as const
  
  // App configuration
  export const APP_CONFIG = {
    NAME: 'EigenProtected AVS',
    DESCRIPTION: 'Your app description',
    DEFAULT_CHAIN: SUPPORTED_CHAINS.SEPOLIA
  } as const
  
  // Export contract address directly
  export const AVS_CONTRACT_ADDRESS = CONTRACT_ADDRESSES.EIGEN_PROTECTED_AVS[11155111]
  
  // RPC URLs for different networks
  export const RPC_URLS = {
    [SUPPORTED_CHAINS.SEPOLIA]: 'https://sepolia.infura.io/v3/443b5049e92748ffba59d71a5972c0e2'
  }

  