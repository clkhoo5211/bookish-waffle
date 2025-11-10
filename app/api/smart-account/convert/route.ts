/**
 * API Route: Convert/Reload USDT to Smart Account
 * POST /api/smart-account/convert
 * 
 * Converts USDT from user's EOA wallet to their smart account
 * Automatically funds gas if needed
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSmartAccount, storeSmartAccount } from '@/lib/backend/storage-service';
// Dynamic imports for heavy dependencies (viem) - only load when needed

/**
 * GET /api/smart-account/convert?eoaAddress=...&chainId=...
 * Check conversion status
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const eoaAddress = searchParams.get('eoaAddress');
    const chainId = searchParams.get('chainId');

    // Basic validation without loading viem
    if (!eoaAddress || !eoaAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { success: false, error: 'Invalid EOA address' },
        { status: 400 }
      );
    }

    const chainIdNum = chainId ? parseInt(chainId, 10) : 56;
    
    let smartAccountInfo = await getSmartAccount(eoaAddress, chainIdNum);

    let accountInfo = smartAccountInfo;

    if (!accountInfo) {
      const { createAndLinkSmartAccount } = await import('@/lib/backend/smart-account-service');
      accountInfo = await createAndLinkSmartAccount(
        eoaAddress as `0x${string}`,
        chainIdNum
      );
      await storeSmartAccount(accountInfo);
    }

    // Only load heavy dependencies when smart account exists
    const { checkConversionStatus } = await import('@/lib/backend/conversion-service');
    
    // Only make RPC calls if smart account exists
    const status = await checkConversionStatus(
      eoaAddress as `0x${string}`,
      accountInfo
    );

    return NextResponse.json({
      success: true,
      status: {
        ...status,
        eoaUSDTBalance: status.eoaUSDTBalance.toString(),
        smartAccountUSDTBalance: status.smartAccountUSDTBalance.toString(),
        smartAccountETHBalance: status.smartAccountETHBalance.toString(),
      },
    });
  } catch (error: any) {
    console.error('Error checking conversion status:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to check conversion status',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/smart-account/convert
 * Prepare conversion transaction
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eoaAddress, chainId, amount } = body;

    // Basic validation without loading viem
    if (!eoaAddress || !eoaAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
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

    // Only load heavy dependencies when smart account exists
    const { checkConversionStatus, prepareUSDTTransferTransaction } = await import('@/lib/backend/conversion-service');
    const { parseUnits } = await import('viem');
    
    // Check status first
    const status = await checkConversionStatus(
      eoaAddress as `0x${string}`,
      smartAccountInfo
    );

    if (!status.hasUSDT) {
      return NextResponse.json(
        {
          success: false,
          error: 'No USDC balance in EOA wallet to convert',
        },
        { status: 400 }
      );
    }

    // Determine amount
    // USDC on Sepolia uses 6 decimals
    const tokenDecimals = 6;
    const amountBigInt = amount 
      ? parseUnits(amount.toString(), tokenDecimals)
      : status.eoaUSDTBalance;

    if (amountBigInt > status.eoaUSDTBalance) {
      return NextResponse.json(
        {
          success: false,
          error: 'Amount exceeds available USDC balance',
        },
        { status: 400 }
      );
    }

    // Fund gas if needed
    let gasFunded = false;
    if (status.needsGasFunding) {
      const { fundSmartAccountWithGas } = await import('@/lib/backend/smart-account-service');
      const fundingResult = await fundSmartAccountWithGas(
        smartAccountInfo.smartAccountAddress,
        chainIdNum,
        parseUnits('0.001', 18)
      );

      if (!fundingResult.success) {
        return NextResponse.json(
          {
            success: false,
            error: `Failed to fund gas: ${fundingResult.error}`,
          },
          { status: 500 }
        );
      }

      gasFunded = true;
      
      // Wait for transaction confirmation
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    // Prepare transfer transaction
    const transferTx = await prepareUSDTTransferTransaction(
      eoaAddress as `0x${string}`,
      smartAccountInfo,
      amountBigInt
    );

    return NextResponse.json({
      success: true,
      gasFunded,
      transferTransaction: {
        ...transferTx,
        value: transferTx.value.toString(),
        gasLimit: transferTx.gasLimit.toString(),
      },
      instructions: {
        step1: 'Sign the transaction below with your wallet',
        step2: 'The USDC will be transferred to your smart account',
        note: gasFunded 
          ? 'Gas has been funded to your smart account (0.001 ETH)'
          : 'Your smart account already has sufficient gas',
      },
    });
  } catch (error: any) {
    console.error('Error preparing conversion:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to prepare conversion',
      },
      { status: 500 }
    );
  }
}

