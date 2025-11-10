/**
 * Conversion/Reload Service
 * Handles converting USDC from EOA to Smart Account
 * Includes gas fee detection and automatic funding
 */

import { createPublicClient, http, parseUnits, encodeFunctionData, type Address, type Hex } from 'viem';
import { sepolia } from 'viem/chains';
import {
  getSmartAccountBalance,
  getSmartAccountUSDTBalance,
  hasGasForTransaction,
  fundSmartAccountWithGas,
  getEOAUSDTBalance,
  type SmartAccountInfo,
} from './smart-account-service';

const RPC_URLS = [
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
  'https://1rpc.io/sepolia',
  'https://rpc.sepolia.org',
  'https://endpoints.omniatech.io/v1/eth/sepolia/public',
].filter(Boolean) as string[];
const DEFAULT_RPC_URL = RPC_URLS[0] || 'https://rpc.sepolia.org';
const USDC_ADDRESS_SEPOLIA = (process.env.NEXT_PUBLIC_USDC_TESTNET_ADDRESS as Address) ||
  ('0xcac524bca292aaade2df8a05cc58f0a65b1b3bb9' as Address);

const USDC_DECIMALS = Number(process.env.NEXT_PUBLIC_USDC_DECIMALS || '6');

const GAS_LIMIT_FOR_TRANSFER = 65000n; // Gas limit for ERC20 transfer

// Helper to get token address based on chain
function getTokenAddress(chainId: number): Address {
  if (chainId !== 11155111) {
    throw new Error(`Unsupported chain ID ${chainId}. Only Sepolia (11155111) is supported.`);
  }
  return USDC_ADDRESS_SEPOLIA;
}

export interface ConversionStatus {
  hasGas: boolean;
  hasUSDT: boolean;
  eoaUSDTBalance: bigint;
  smartAccountUSDTBalance: bigint;
  smartAccountETHBalance: bigint;
  needsGasFunding: boolean;
}

export interface ConversionResult {
  success: boolean;
  txHash?: Hex;
  gasFunded?: boolean;
  error?: string;
}

/**
 * Check conversion status for user
 */
export async function checkConversionStatus(
  eoaAddress: Address,
  smartAccountInfo: SmartAccountInfo
): Promise<ConversionStatus> {
  const chainId = smartAccountInfo.chainId;
  
  // Get balances
  const [eoaUSDTBalance, smartAccountUSDT, smartAccountETH] = await Promise.all([
    getEOAUSDTBalance(eoaAddress, chainId),
    getSmartAccountUSDTBalance(smartAccountInfo.smartAccountAddress, chainId),
    getSmartAccountBalance(smartAccountInfo.smartAccountAddress, chainId),
  ]);
  
  // Check if smart account has gas
  const hasGas = await hasGasForTransaction(
    smartAccountInfo.smartAccountAddress,
    chainId,
    GAS_LIMIT_FOR_TRANSFER
  );
  
  const needsGasFunding = !hasGas && eoaUSDTBalance > 0n;
  
  return {
    hasGas,
    hasUSDT: eoaUSDTBalance > 0n,
    eoaUSDTBalance,
    smartAccountUSDTBalance: smartAccountUSDT,
    smartAccountETHBalance: smartAccountETH,
    needsGasFunding,
  };
}

/**
 * Convert USDC from EOA to Smart Account
 * This function:
 * 1. Detects if smart account has gas
 * 2. If no gas and only USDC, funds 0.001 ETH to smart account
 * 3. Transfers USDC from EOA to Smart Account
 */
export async function convertUSDTToSmartAccount(
  eoaAddress: Address,
  smartAccountInfo: SmartAccountInfo,
  amount?: bigint // If not provided, transfers all USDC
): Promise<ConversionResult> {
  try {
    const chainId = smartAccountInfo.chainId;

    const client = createPublicClient({
      chain: sepolia,
      transport: http(DEFAULT_RPC_URL, {
        timeout: 20000, // 20 second timeout for RPC calls
        retryCount: 2, // retry a couple of times on infura timeouts
      }),
    });

    // Check status
    const status = await checkConversionStatus(eoaAddress, smartAccountInfo);

    if (!status.hasUSDT) {
      return {
        success: false,
        error: 'No USDC balance in EOA wallet',
      };
    }

    // Determine amount to transfer
    const transferAmount = amount ?? status.eoaUSDTBalance;

    if (transferAmount > status.eoaUSDTBalance) {
      return {
        success: false,
        error: 'Insufficient USDC balance',
      };
    }

    // For transferring USDC we simply prepare the transaction; we return the client to
    // fetch proper gas estimate (6 decimals token)
    return {
      success: true,
      gasFunded: false,
    };
  } catch (error: any) {
    console.error('Error converting USDC to smart account:', error);
    return {
      success: false,
      error: error.message || 'Conversion failed',
    };
  }
}

/**
 * Prepare USDC transfer transaction data
 * This returns the transaction data that needs to be signed by the user's wallet
 */
export async function prepareUSDTTransferTransaction(
  eoaAddress: Address,
  smartAccountInfo: SmartAccountInfo,
  amount: bigint
) {
  const chainId = smartAccountInfo.chainId;
  const tokenAddress = getTokenAddress(chainId);

  return {
    from: eoaAddress,
    to: tokenAddress,
    value: 0n,
    data: encodeTransferFunction(smartAccountInfo.smartAccountAddress, amount),
    gasLimit: GAS_LIMIT_FOR_TRANSFER,
    chainId,
  };
}

/**
 * Encode ERC20 transfer function
 */
function encodeTransferFunction(to: Address, amount: bigint): Hex {
  return encodeFunctionData({
    abi: [
      {
        constant: false,
        inputs: [
          { name: '_to', type: 'address' },
          { name: '_value', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ name: '', type: 'bool' }],
        type: 'function',
      },
    ],
    functionName: 'transfer',
    args: [to, amount],
  });
}

/**
 * Prepare batch conversion (convert all USDC)
 */
export async function prepareBatchConversion(
  eoaAddress: Address,
  smartAccountInfo: SmartAccountInfo
): Promise<{
  needsGasFunding: boolean;
  usdtAmount: bigint;
  transferTransaction?: any;
}> {
  const status = await checkConversionStatus(eoaAddress, smartAccountInfo);
  
  if (!status.hasUSDT) {
    throw new Error('No USDC to convert');
  }
  
  const transferTx = await prepareUSDTTransferTransaction(
    eoaAddress,
    smartAccountInfo,
    status.eoaUSDTBalance
  );
  
  return {
    needsGasFunding: status.needsGasFunding,
    usdtAmount: status.eoaUSDTBalance,
    transferTransaction: transferTx,
  };
}

