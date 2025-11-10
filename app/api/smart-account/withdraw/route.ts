/**
 * API Route: Withdraw USDT from Smart Account
 * POST /api/smart-account/withdraw
 * 
 * Withdraws USDT from user's smart account back to their EOA wallet
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  checkWithdrawalStatus,
  prepareWithdrawalTransaction,
  withdrawAllUSDC,
  type WithdrawalResult,
} from '@/lib/backend/withdrawal-service';
import type { SmartAccountInfo } from '@/lib/backend/smart-account-service';
import { isAddress, parseUnits } from 'viem';
import { getSmartAccount, storeSmartAccount } from '@/lib/backend/storage-service';

/**
 * GET /api/smart-account/withdraw?eoaAddress=...&chainId=...
 * Check withdrawal status
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const eoaAddress = searchParams.get('eoaAddress');
    const chainId = searchParams.get('chainId');

    if (!eoaAddress || !isAddress(eoaAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid EOA address' },
        { status: 400 }
      );
    }

    const chainIdNum = chainId ? parseInt(chainId, 10) : 56;
    const smartAccountInfo = await getSmartAccount(eoaAddress, chainIdNum);

    let accountInfo = smartAccountInfo;

    if (!accountInfo) {
      const { createAndLinkSmartAccount } = await import('@/lib/backend/smart-account-service');
      accountInfo = await createAndLinkSmartAccount(
        eoaAddress as `0x${string}`,
        chainIdNum
      );
      await storeSmartAccount(accountInfo);
    }

    const status = await checkWithdrawalStatus(accountInfo);

    return NextResponse.json({
      success: true,
      status: {
        ...status,
        smartAccountUSDTBalance: status.smartAccountUSDTBalance.toString(),
      },
    });
  } catch (error: any) {
    console.error('Error checking withdrawal status:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to check withdrawal status',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/smart-account/withdraw
 * Prepare withdrawal transaction
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eoaAddress, chainId, amount, withdrawAll } = body;

    // Validate input
    if (!eoaAddress || !isAddress(eoaAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid EOA address' },
        { status: 400 }
      );
    }

    const chainIdNum = chainId ? parseInt(chainId, 10) : 56;
    let smartAccountInfo = await getSmartAccount(eoaAddress, chainIdNum);

    if (!smartAccountInfo) {
      const { createAndLinkSmartAccount } = await import('@/lib/backend/smart-account-service');
      smartAccountInfo = await createAndLinkSmartAccount(
        eoaAddress as `0x${string}`,
        chainIdNum
      );
      await storeSmartAccount(smartAccountInfo);
    }

    // Check withdrawal status
    const status = await checkWithdrawalStatus(smartAccountInfo);

    if (!status.hasUSDT) {
      return NextResponse.json(
        {
          success: false,
          error: 'No USDC balance in smart account to withdraw',
        },
        { status: 400 }
      );
    }

    if (!status.hasGas) {
      return NextResponse.json(
        {
          success: false,
          error: 'Smart account has insufficient ETH for gas fees. Please fund it first.',
        },
        { status: 400 }
      );
    }

    // Prepare withdrawal
    let result: WithdrawalResult;
    if (withdrawAll) {
      result = await withdrawAllUSDC(smartAccountInfo);
    } else {
      if (!amount) {
        return NextResponse.json(
          {
            success: false,
            error: 'Amount is required when withdrawAll is false',
          },
          { status: 400 }
        );
      }

      const amountBigInt = parseUnits(amount.toString(), 6);
      result = await prepareWithdrawalTransaction(smartAccountInfo, amountBigInt);
    }

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Failed to prepare withdrawal',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      userOperation: result.userOperation
        ? {
            ...result.userOperation,
            callGasLimit: result.userOperation.callGasLimit?.toString(),
            verificationGasLimit: result.userOperation.verificationGasLimit?.toString(),
            preVerificationGas: result.userOperation.preVerificationGas?.toString(),
            maxFeePerGas: result.userOperation.maxFeePerGas?.toString(),
            maxPriorityFeePerGas: result.userOperation.maxPriorityFeePerGas?.toString(),
            nonce: result.userOperation.nonce?.toString(),
          }
        : undefined,
      amount: result.amount ? result.amount.toString() : undefined,
      instructions: {
        step1: 'Sign the UserOperation with your wallet',
        step2: 'Submit the UserOperation to the bundler',
        step3: 'The USDC will be transferred to your EOA wallet',
        note: 'This is an ERC-4337 UserOperation that needs to be signed and submitted',
      },
    });
  } catch (error: any) {
    console.error('Error preparing withdrawal:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to prepare withdrawal',
      },
      { status: 500 }
    );
  }
}

