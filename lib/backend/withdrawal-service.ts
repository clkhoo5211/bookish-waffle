/**
 * Withdrawal Service
 * Handles withdrawing USDC from Smart Account back to user's EOA wallet
 */

import { parseUnits, encodeFunctionData, type Address, type Hex } from 'viem';
import {
  getSmartAccountUSDTBalance,
  hasGasForTransaction,
  type SmartAccountInfo,
} from './smart-account-service';

const USDC_ADDRESS_SEPOLIA =
  ((process.env.NEXT_PUBLIC_USDC_TESTNET_ADDRESS as Address) ||
    ('0xcac524bca292aaade2df8a05cc58f0a65b1b3bb9' as Address));

const GAS_LIMIT_FOR_WITHDRAWAL = 65000n; // Gas limit for ERC20 transfer from smart account

// Helper to get token address based on chain
function getTokenAddress(chainId: number): Address {
  if (chainId !== 11155111) {
    throw new Error(`Unsupported chain ID ${chainId}. Only Sepolia (11155111) is supported.`);
  }
  return USDC_ADDRESS_SEPOLIA;
}

export interface WithdrawalStatus {
  hasGas: boolean;
  hasUSDT: boolean;
  smartAccountUSDTBalance: bigint;
  canWithdraw: boolean;
}

export interface WithdrawalResult {
  success: boolean;
  txHash?: Hex;
  error?: string;
  userOperationHash?: string; // For ERC-4337 UserOperation
  userOperation?: any;
  amount?: bigint;
}

/**
 * Check withdrawal status
 */
export async function checkWithdrawalStatus(
  smartAccountInfo: SmartAccountInfo
): Promise<WithdrawalStatus> {
  const chainId = smartAccountInfo.chainId;
  
  // Get balances
  const [smartAccountUSDT, hasGas] = await Promise.all([
    getSmartAccountUSDTBalance(smartAccountInfo.smartAccountAddress, chainId),
    hasGasForTransaction(smartAccountInfo.smartAccountAddress, chainId, GAS_LIMIT_FOR_WITHDRAWAL),
  ]);
  
  return {
    hasGas,
    hasUSDT: smartAccountUSDT > 0n,
    smartAccountUSDTBalance: smartAccountUSDT,
    canWithdraw: hasGas && smartAccountUSDT > 0n,
  };
}

/**
 * Prepare withdrawal transaction
 * Withdraws USDC from Smart Account to user's EOA
 */
export async function prepareWithdrawalTransaction(
  smartAccountInfo: SmartAccountInfo,
  amount: bigint
): Promise<WithdrawalResult> {
  try {
    const status = await checkWithdrawalStatus(smartAccountInfo);
    
    if (!status.hasUSDT) {
      return {
        success: false,
        error: 'No USDC balance in smart account',
      };
    }
    
    if (amount > status.smartAccountUSDTBalance) {
      return {
        success: false,
        error: 'Insufficient USDC balance in smart account',
      };
    }
    
    if (!status.hasGas) {
      return {
        success: false,
        error: 'Smart account has insufficient ETH for gas fees',
      };
    }
    
    // Prepare UserOperation for ERC-4337
    // This would create a UserOperation that calls the token transfer function
    // from the smart account to the user's EOA
    
    const userOperation = {
      sender: smartAccountInfo.smartAccountAddress,
      nonce: 0n, // Would need to fetch actual nonce
      initCode: '0x' as Hex,
      callData: encodeWithdrawalCallData(smartAccountInfo.eoaAddress, amount, smartAccountInfo.chainId),
      callGasLimit: GAS_LIMIT_FOR_WITHDRAWAL,
      verificationGasLimit: 100000n,
      preVerificationGas: 21000n,
      maxFeePerGas: parseUnits('5', 9), // 5 gwei
      maxPriorityFeePerGas: parseUnits('2', 9), // 2 gwei
      paymasterAndData: '0x' as Hex, // Could use paymaster for gasless withdrawal
      signature: '0x' as Hex, // To be signed by the user
    };
    
    return {
      success: true,
      userOperation,
      amount,
    };
  } catch (error: any) {
    console.error('Error preparing withdrawal:', error);
    return {
      success: false,
      error: error.message || 'Failed to prepare withdrawal',
    };
  }
}

/**
 * Encode withdrawal call data
 * This creates the call data for the smart account to execute a USDT/USDC transfer
 */
function encodeWithdrawalCallData(to: Address, amount: bigint, chainId: number): Hex {
  const tokenAddress = getTokenAddress(chainId);
  
  // The smart account's execute function
  // This would be specific to your smart account implementation
  // For ERC-4337, this is typically an execute function that calls the token contract
  
  return encodeFunctionData({
    abi: [
      {
        inputs: [
          { name: 'dest', type: 'address' },
          { name: 'value', type: 'uint256' },
          { name: 'func', type: 'bytes' },
        ],
        name: 'execute',
        outputs: [],
        type: 'function',
      },
    ],
    functionName: 'execute',
    args: [
      tokenAddress, // Token contract address (USDT on mainnet, USDC on testnet)
      0n, // No value (we're calling a function, not sending ETH)
      encodeUSDCTransfer(to, amount), // Encoded token transfer call
    ],
  });
}

/**
 * Encode USDC transfer function call
 */
function encodeUSDCTransfer(to: Address, amount: bigint): Hex {
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
 * Withdraw all USDC from smart account
 */
export async function withdrawAllUSDC(
  smartAccountInfo: SmartAccountInfo
): Promise<WithdrawalResult> {
  const status = await checkWithdrawalStatus(smartAccountInfo);
  
  if (!status.hasUSDT) {
    return {
      success: false,
      error: 'No USDC to withdraw',
    };
  }
  
  const result = await prepareWithdrawalTransaction(
    smartAccountInfo,
    status.smartAccountUSDTBalance
  );
  
  if (result.success) {
    return {
      success: true,
      userOperation: result.userOperation,
      amount: status.smartAccountUSDTBalance,
    };
  }
  
  return result;
}

