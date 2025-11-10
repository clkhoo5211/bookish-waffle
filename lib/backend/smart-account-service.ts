/**
 * Smart Account Service
 * Handles creation, linking, and management of smart accounts for wallets
 * that don't natively support smart accounts (Binance Wallet, Trust Wallet, etc.)
 */

import { createPublicClient, createWalletClient, http, formatUnits, parseUnits, type Address, type Hex } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

const SEPOLIA_CHAIN_ID = 11155111;
const RPC_URLS = [
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
  'https://1rpc.io/sepolia',
  'https://rpc.sepolia.org',
  'https://endpoints.omniatech.io/v1/eth/sepolia/public',
].filter(Boolean) as string[];
const DEFAULT_RPC_URL = RPC_URLS[0] || 'https://rpc.sepolia.org';

// ERC-4337 EntryPoint address (standard across chains)
const ENTRYPOINT_ADDRESS_SEPOLIA = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789' as Address;

// Pimlico SimpleAccountFactory address (deployed on Sepolia)
const SIMPLE_ACCOUNT_FACTORY_SEPOLIA = (process.env.NEXT_PUBLIC_SMART_ACCOUNT_FACTORY_ADDRESS as Address) ||
  ('0x9406Cc6185a346906296840746125a0E44976454' as Address);

// USDC token on Sepolia
const USDC_ADDRESS_SEPOLIA = (process.env.NEXT_PUBLIC_USDC_TESTNET_ADDRESS as Address) ||
  ('0xcac524bca292aaade2df8a05cc58f0a65b1b3bb9' as Address);

function assertSupportedChain(chainId: number) {
  if (chainId !== SEPOLIA_CHAIN_ID) {
    throw new Error(`Unsupported chain ID ${chainId}. Only Sepolia (11155111) is supported.`);
  }
}

// Helper functions to get chain-specific addresses
function getEntryPointAddress(chainId: number): Address {
  assertSupportedChain(chainId);
  return ENTRYPOINT_ADDRESS_SEPOLIA;
}

function getFactoryAddress(chainId: number): Address {
  assertSupportedChain(chainId);
  return SIMPLE_ACCOUNT_FACTORY_SEPOLIA;
}

function getTokenAddress(chainId: number): Address {
  assertSupportedChain(chainId);
  return USDC_ADDRESS_SEPOLIA;
}

// Service account private key (for funding gas fees) - MUST be kept secure
const SERVICE_ACCOUNT_PRIVATE_KEY = process.env.SERVICE_ACCOUNT_PRIVATE_KEY as Hex;

// Gas funding amount (0.001 ETH)
const GAS_FUNDING_AMOUNT = parseUnits('0.001', 18);

export interface SmartAccountInfo {
  eoaAddress: Address; // User's original wallet address
  smartAccountAddress: Address; // Smart account address
  isDeployed: boolean;
  chainId: number;
  createdAt: number;
  linkedAt: number;
}

export interface WalletType {
  type: 'metamask' | 'binance' | 'trust' | 'walletconnect' | 'unknown';
  supportsSmartAccounts: boolean;
  name: string;
}

/**
 * Detect wallet type and smart account support
 */
export function detectWalletType(userAgent: string, walletName?: string): WalletType {
  const ua = userAgent.toLowerCase();
  
  if (walletName) {
    const name = walletName.toLowerCase();
    
    if (name.includes('metamask')) {
      return {
        type: 'metamask',
        supportsSmartAccounts: true, // MetaMask supports smart accounts via extensions
        name: 'MetaMask',
      };
    }
    
    if (name.includes('binance') || name.includes('binance wallet')) {
      return {
        type: 'binance',
        supportsSmartAccounts: false,
        name: 'Binance Wallet',
      };
    }
    
    if (name.includes('trust') || name.includes('trust wallet')) {
      return {
        type: 'trust',
        supportsSmartAccounts: false,
        name: 'Trust Wallet',
      };
    }
    
    if (name.includes('walletconnect')) {
      return {
        type: 'walletconnect',
        supportsSmartAccounts: false, // Depends on the connected wallet
        name: 'WalletConnect',
      };
    }
  }
  
  // Check user agent for wallet detection
  if (ua.includes('trustwallet')) {
    return {
      type: 'trust',
      supportsSmartAccounts: false,
      name: 'Trust Wallet',
    };
  }
  
  if (ua.includes('binance')) {
    return {
      type: 'binance',
      supportsSmartAccounts: false,
      name: 'Binance Wallet',
    };
  }
  
  return {
    type: 'unknown',
    supportsSmartAccounts: false,
    name: 'Unknown Wallet',
  };
}

/**
 * Get public client for the specified chain
 */
function getPublicClient(chainId: number) {
  assertSupportedChain(chainId);
  return createPublicClient({
    chain: sepolia,
    transport: http(DEFAULT_RPC_URL, {
      timeout: 10000,
      retryCount: 1,
    }),
  });
}

/**
 * Calculate smart account address for a given EOA
 * Uses Pimlico's SimpleAccountFactory getAddress function
 */
export async function calculateSmartAccountAddress(
  eoaAddress: Address,
  chainId: number,
  salt: bigint = 0n
): Promise<Address> {
  assertSupportedChain(chainId);
  const client = getPublicClient(chainId);
  const factoryAddress = getFactoryAddress(chainId);
  const entryPointAddress = getEntryPointAddress(chainId);
  
  try {
    // Call the factory's getAddress function
    // SimpleAccountFactory.getAddress(owner, salt)
    const smartAccountAddress = await client.readContract({
      address: factoryAddress,
      abi: [
        {
          inputs: [
            { name: 'owner', type: 'address' },
            { name: 'salt', type: 'uint256' },
          ],
          name: 'getAddress',
          outputs: [{ name: 'ret', type: 'address' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'getAddress',
      args: [eoaAddress, salt],
    });
    
    return smartAccountAddress as Address;
  } catch (error) {
    console.error('Error calculating smart account address from factory:', error);
    // Fallback to deterministic calculation if factory call fails
    const { keccak256, toBytes, concat } = await import('viem');
    const addressBytes = toBytes(eoaAddress);
    const saltBytes = toBytes(salt);
    const chainBytes = toBytes(chainId);
    const hash = keccak256(concat([addressBytes, saltBytes, chainBytes]));
    return `0x${hash.slice(2, 42)}` as Address;
  }
}

/**
 * Check if smart account is deployed
 */
export async function isSmartAccountDeployed(
  smartAccountAddress: Address,
  chainId: number
): Promise<boolean> {
  assertSupportedChain(chainId);
  try {
    const client = getPublicClient(chainId);
    const code = await client.getBytecode({ address: smartAccountAddress });
    return code !== undefined && code !== '0x';
  } catch (error) {
    console.error('Error checking smart account deployment:', error);
    return false;
  }
}

/**
 * Create and link smart account for user
 * This would be called when user first connects with a wallet that doesn't support smart accounts
 */
export async function createAndLinkSmartAccount(
  eoaAddress: Address,
  chainId: number
): Promise<SmartAccountInfo> {
  assertSupportedChain(chainId);
  const client = getPublicClient(chainId);
  
  // Calculate smart account address
  const smartAccountAddress = await calculateSmartAccountAddress(eoaAddress, chainId);
  
  // Check if already deployed
  const isDeployed = await isSmartAccountDeployed(smartAccountAddress, chainId);
  
  const now = Date.now();
  
  const smartAccountInfo: SmartAccountInfo = {
    eoaAddress,
    smartAccountAddress,
    isDeployed,
    chainId,
    createdAt: now,
    linkedAt: now,
  };
  
  // In production, you would:
  // 1. Store this mapping in a database
  // 2. Deploy the smart account if not deployed (via factory contract)
  // 3. Link the EOA to the smart account in your backend
  
  return smartAccountInfo;
}

/**
 * Get smart account balance (ETH)
 */
export async function getSmartAccountBalance(
  smartAccountAddress: Address,
  chainId: number
): Promise<bigint> {
  assertSupportedChain(chainId);
  const client = getPublicClient(chainId);
  return await client.getBalance({ address: smartAccountAddress });
}

/**
 * Get smart account USDT/USDC balance
 */
export async function getSmartAccountUSDTBalance(
  smartAccountAddress: Address,
  chainId: number
): Promise<bigint> {
  assertSupportedChain(chainId);
  const client = getPublicClient(chainId);
  const tokenAddress = getTokenAddress(chainId);
  
  // ERC20 balanceOf function
  const balance = await client.readContract({
    address: tokenAddress,
    abi: [
      {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
      },
    ],
    functionName: 'balanceOf',
    args: [smartAccountAddress],
  });
  
  return balance as bigint;
}

/**
 * Check if smart account has gas (ETH)
 */
export async function hasGasForTransaction(
  smartAccountAddress: Address,
  chainId: number,
  gasLimit: bigint = 21000n // Default simple transfer gas
): Promise<boolean> {
  assertSupportedChain(chainId);
  const balance = await getSmartAccountBalance(smartAccountAddress, chainId);
  
  // Estimate gas price
  const client = getPublicClient(chainId);
  const gasPrice = await client.getGasPrice();
  
  // Calculate required gas cost
  const requiredGas = gasPrice * gasLimit;
  
  return balance >= requiredGas;
}

/**
 * Fund smart account with ETH for gas fees
 */
export async function fundSmartAccountWithGas(
  smartAccountAddress: Address,
  chainId: number,
  amount: bigint = GAS_FUNDING_AMOUNT
): Promise<{ success: boolean; txHash?: Hex; error?: string }> {
  assertSupportedChain(chainId);
  if (!SERVICE_ACCOUNT_PRIVATE_KEY) {
    return {
      success: false,
      error: 'Service account not configured',
    };
  }
  
  try {
    const publicClient = getPublicClient(chainId);
    const serviceAccount = privateKeyToAccount(SERVICE_ACCOUNT_PRIVATE_KEY);
    
    // Check service account balance
    const serviceBalance = await publicClient.getBalance({ address: serviceAccount.address });
    if (serviceBalance < amount) {
      return {
        success: false,
        error: 'Service account has insufficient balance',
      };
    }
    
    // Create wallet client for sending transactions
    const walletClient = createWalletClient({
      account: serviceAccount,
      chain: sepolia,
      transport: http(DEFAULT_RPC_URL, {
        timeout: 10000,
        retryCount: 1,
      }),
    });
    
    // Send ETH to smart account
    const txHash = await walletClient.sendTransaction({
      to: smartAccountAddress,
      value: amount,
    });
    
    // Wait for transaction confirmation
    await publicClient.waitForTransactionReceipt({ hash: txHash });
    
    return {
      success: true,
      txHash,
    };
  } catch (error: any) {
    console.error('Error funding smart account:', error);
    return {
      success: false,
      error: error.message || 'Failed to fund smart account',
    };
  }
}

/**
 * Get user's EOA balance (ETH)
 */
export async function getEOABalance(eoaAddress: Address, chainId: number): Promise<bigint> {
  assertSupportedChain(chainId);
  const client = getPublicClient(chainId);
  return await client.getBalance({ address: eoaAddress });
}

/**
 * Get user's EOA USDT/USDC balance
 */
export async function getEOAUSDTBalance(eoaAddress: Address, chainId: number): Promise<bigint> {
  assertSupportedChain(chainId);
  const client = getPublicClient(chainId);
  const tokenAddress = getTokenAddress(chainId);
  
  const balance = await client.readContract({
    address: tokenAddress,
    abi: [
      {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
      },
    ],
    functionName: 'balanceOf',
    args: [eoaAddress],
  });
  
  return balance as bigint;
}

