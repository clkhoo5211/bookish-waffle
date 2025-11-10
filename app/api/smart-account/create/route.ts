/**
 * API Route: Create and Link Smart Account
 * POST /api/smart-account/create
 * 
 * Creates a smart account for a user's EOA wallet and links them together
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  createAndLinkSmartAccount,
  detectWalletType,
  type SmartAccountInfo,
} from '@/lib/backend/smart-account-service';
import { getSmartAccount, storeSmartAccount } from '@/lib/backend/storage-service';
import { isAddress } from 'viem';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eoaAddress, chainId, userAgent, walletName } = body;

    // Validate input
    if (!eoaAddress || !isAddress(eoaAddress)) {
      return NextResponse.json(
        { success: false, error: 'Invalid EOA address' },
        { status: 400 }
      );
    }

    if (!chainId || chainId !== 11155111) {
      return NextResponse.json(
        { success: false, error: 'Invalid chain ID. Supported: 11155111 (Ethereum Sepolia)' },
        { status: 400 }
      );
    }

    // Detect wallet type
    const walletType = detectWalletType(userAgent || '', walletName);
    
    // Check if smart account already exists
    const existing = await getSmartAccount(eoaAddress, chainId);
    
    if (existing) {
      return NextResponse.json({
        success: true,
        alreadyExists: true,
        smartAccount: existing,
        walletType,
      });
    }

    // Create and link smart account
    const smartAccountInfo = await createAndLinkSmartAccount(
      eoaAddress as `0x${string}`,
      chainId
    );

    // Store smart account
    await storeSmartAccount(smartAccountInfo);

    return NextResponse.json({
      success: true,
      smartAccount: smartAccountInfo,
      walletType,
      message: 'Smart account created and linked successfully',
    });
  } catch (error: any) {
    console.error('Error creating smart account:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create smart account',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/smart-account/create?eoaAddress=...&chainId=...
 * Get existing smart account info
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
    const existing = await getSmartAccount(eoaAddress, chainIdNum);

    if (!existing) {
      const smartAccountInfo = await createAndLinkSmartAccount(
        eoaAddress as `0x${string}`,
        chainIdNum
      );
      await storeSmartAccount(smartAccountInfo);

      return NextResponse.json({
        success: true,
        smartAccount: smartAccountInfo,
        created: true,
      });
    }

    return NextResponse.json({
      success: true,
      smartAccount: existing,
    });
  } catch (error: any) {
    console.error('Error fetching smart account:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch smart account',
      },
      { status: 500 }
    );
  }
}

