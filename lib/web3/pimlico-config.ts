/**
 * Pimlico Configuration for BSC Smart Accounts
 * Note: User provided Polygon API key, but we're using BSC (Chain 56/97)
 * Update the API key if needed for BSC-specific key
 */

export const PIMLICO_API_KEY = process.env.NEXT_PUBLIC_PIMLICO_API_KEY || 'pim_Yf1fPJzGN9U19FFyyvCfmd';

// BSC Chain IDs
export const BSC_MAINNET_CHAIN_ID = 56;
export const BSC_TESTNET_CHAIN_ID = 97;

// Pimlico endpoints for BSC (corrected from Polygon)
export const PIMLICO_CONFIG = {
  // BSC Mainnet
  bscMainnet: {
    chainId: BSC_MAINNET_CHAIN_ID,
    paymasterUrl: `https://api.pimlico.io/v2/${BSC_MAINNET_CHAIN_ID}/rpc?apikey=${PIMLICO_API_KEY}`,
    bundlerUrl: `https://api.pimlico.io/v2/${BSC_MAINNET_CHAIN_ID}/rpc?apikey=${PIMLICO_API_KEY}`,
  },
  // BSC Testnet
  bscTestnet: {
    chainId: BSC_TESTNET_CHAIN_ID,
    paymasterUrl: `https://api.pimlico.io/v2/${BSC_TESTNET_CHAIN_ID}/rpc?apikey=${PIMLICO_API_KEY}`,
    bundlerUrl: `https://api.pimlico.io/v2/${BSC_TESTNET_CHAIN_ID}/rpc?apikey=${PIMLICO_API_KEY}`,
  },
};

/**
 * Get Pimlico paymaster URL for current chain
 */
export function getPaymasterUrl(chainId: number): string {
  switch (chainId) {
    case BSC_MAINNET_CHAIN_ID:
      return PIMLICO_CONFIG.bscMainnet.paymasterUrl;
    case BSC_TESTNET_CHAIN_ID:
      return PIMLICO_CONFIG.bscTestnet.paymasterUrl;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}. Only BSC (56) and BSC Testnet (97) are supported.`);
  }
}

/**
 * Get Pimlico bundler URL for current chain
 */
export function getBundlerUrl(chainId: number): string {
  switch (chainId) {
    case BSC_MAINNET_CHAIN_ID:
      return PIMLICO_CONFIG.bscMainnet.bundlerUrl;
    case BSC_TESTNET_CHAIN_ID:
      return PIMLICO_CONFIG.bscTestnet.bundlerUrl;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}. Only BSC (56) and BSC Testnet (97) are supported.`);
  }
}

