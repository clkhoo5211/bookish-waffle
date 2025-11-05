'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { RefreshCw, CheckCircle, AlertCircle, Gift } from 'lucide-react';
import { BottomNav } from '@/components/ui/BottomNav';
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { parseEther, parseUnits, formatEther } from 'viem';

// Get basePath for assets (GitHub Pages needs this)
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const swapTiers = [
  { total: 11000, base: 10000, bonus: 1000, priceInUSD: 100 }, // $100
  { total: 22200, base: 20000, bonus: 2200, priceInUSD: 200 }, // $200
  { total: 56000, base: 50000, bonus: 6000, priceInUSD: 500 }  // $500
];

// Contract addresses from environment variables
const TOKEN_ADDRESSES = {
  USDT: (process.env.NEXT_PUBLIC_USDT_TOKEN_ADDRESS || '0x55d398326f99059fF775485246999027B3197955') as `0x${string}`,
  USDC_TESTNET: (process.env.NEXT_PUBLIC_USDC_TESTNET_ADDRESS || '0x31873b5804bABE258d6ea008f55e08DD00b7d51E') as `0x${string}`,
  USD1: (process.env.NEXT_PUBLIC_USD1_TOKEN_ADDRESS || '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82') as `0x${string}`,
  RVM_CONTRACT: (process.env.NEXT_PUBLIC_RVM_SWAP_CONTRACT || '0x0000000000000000000000000000000000000000') as `0x${string}`
};

// ERC-20 ABI for approve function
const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ type: 'bool' }]
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    outputs: [{ type: 'uint256' }]
  }
] as const;

type SwapStep = 'idle' | 'checking' | 'approving' | 'swapping' | 'success' | 'error';

export default function SwapPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<'BNB' | 'USDT' | 'USD1'>('BNB');
  const [swapStep, setSwapStep] = useState<SwapStep>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [needsApproval, setNeedsApproval] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimError, setClaimError] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Get balances
  const { data: bnbBalance } = useBalance({ address });
  
  // For USDT: Use USDC on testnet (97), USDT on mainnet (56)
  const { data: usdtBalance } = useBalance({ 
    address,
    token: chainId === 97 ? TOKEN_ADDRESSES.USDC_TESTNET : TOKEN_ADDRESSES.USDT
  });
  
  const { data: usd1Balance } = useBalance({ 
    address,
    token: TOKEN_ADDRESSES.USD1
  });

  // Contract write hooks
  const { 
    writeContract: approveToken,
    data: approveHash,
    isPending: isApprovePending
  } = useWriteContract();

  const { 
    writeContract: executeSwap,
    data: swapHash,
    isPending: isSwapPending
  } = useWriteContract();

  // Wait for transactions
  const { isLoading: isApproveLoading, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const { isLoading: isSwapLoading, isSuccess: isSwapSuccess } = useWaitForTransactionReceipt({
    hash: swapHash,
  });

  // Calculate required amount based on selected tier and currency
  const getRequiredAmount = () => {
    if (selectedTier === null) return '0';
    const tier = swapTiers[selectedTier];
    // Simplified pricing: 1 RVM = 0.01 USD equivalent
    // For BNB: assume 1 BNB = $300, so 100 USD = 0.33 BNB
    // For USDT/CAKE: direct USD value
    
    switch (selectedCurrency) {
      case 'BNB':
        return (tier.priceInUSD / 300).toFixed(4); // Assuming BNB = $300
      case 'USDT':
      case 'USD1':
        return tier.priceInUSD.toString();
      default:
        return '0';
    }
  };

  const handleSwap = async () => {
    if (!isConnected || !address) {
      setErrorMessage('Please connect your wallet first');
      setSwapStep('error');
      return;
    }

    if (selectedTier === null) {
      setErrorMessage('Please select a swap tier');
      setSwapStep('error');
      return;
    }

    try {
      setSwapStep('checking');
      setErrorMessage('');

      const requiredAmount = getRequiredAmount();
      
      // Check balance
      const currentBalance = selectedCurrency === 'BNB' 
        ? bnbBalance 
        : selectedCurrency === 'USDT' 
        ? usdtBalance 
        : usd1Balance;

      if (!currentBalance || parseFloat(formatEther(currentBalance.value)) < parseFloat(requiredAmount)) {
        const displayCurrency = selectedCurrency === 'USDT' && chainId === 97 ? 'USDC' : selectedCurrency;
        setErrorMessage(`Insufficient ${displayCurrency} balance`);
        setSwapStep('error');
        return;
      }

      // For ERC-20 tokens, check and handle approval
      if (selectedCurrency === 'USDT' || selectedCurrency === 'USD1') {
        setSwapStep('approving');
        
        // Use USDC on testnet, USDT on mainnet
        const tokenAddress = selectedCurrency === 'USDT' 
          ? (chainId === 97 ? TOKEN_ADDRESSES.USDC_TESTNET : TOKEN_ADDRESSES.USDT)
          : TOKEN_ADDRESSES.USD1;
        const amountToApprove = parseUnits(requiredAmount, 18); // Assuming 18 decimals
        
        // Approve the RVM contract to spend tokens
        approveToken({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [TOKEN_ADDRESSES.RVM_CONTRACT, amountToApprove],
        });
      } else {
        // For BNB, proceed directly to swap
        performSwap();
      }
    } catch (error: any) {
      console.error('Swap error:', error);
      setErrorMessage(error.message || 'Transaction failed');
      setSwapStep('error');
    }
  };

  const performSwap = async () => {
    setSwapStep('swapping');
    
    // Mock swap transaction (replace with actual RVM contract call)
    // This would call the RVM contract's swap function
    try {
      const tier = swapTiers[selectedTier!];
      const requiredAmount = getRequiredAmount();
      
      // For demo purposes, simulate a successful swap
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, you would call:
      // executeSwap({
      //   address: TOKEN_ADDRESSES.RVM_CONTRACT,
      //   abi: RVM_CONTRACT_ABI,
      //   functionName: 'swap',
      //   args: [selectedCurrency, parseUnits(requiredAmount, 18), tier.total],
      //   value: selectedCurrency === 'BNB' ? parseEther(requiredAmount) : undefined
      // });
      
      setSwapStep('success');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: any) {
      console.error('Swap execution error:', error);
      setErrorMessage(error.message || 'Swap failed');
      setSwapStep('error');
    }
  };

  // Effect to handle approval success
  useEffect(() => {
    if (isApproveSuccess && swapStep === 'approving') {
      performSwap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isApproveSuccess, swapStep]);

  const getButtonText = () => {
    switch (swapStep) {
      case 'checking':
        return 'Checking Balance...';
      case 'approving':
        return `Approving ${selectedCurrency}...`;
      case 'swapping':
        return 'Swapping...';
      case 'success':
        return 'Swap Successful!';
      case 'error':
        return 'Try Again';
      default:
        return 'SWAP NOW';
    }
  };

  const isLoading = swapStep === 'checking' || swapStep === 'approving' || swapStep === 'swapping';
  
  // Claim USDC from testnet faucet
  const handleClaimUSDC = async () => {
    if (!isConnected || !address) {
      setClaimError('Please connect your wallet first');
      return;
    }

    if (chainId !== 97) {
      setClaimError('Please switch to BSC Testnet (Chain ID 97) to claim testnet USDC');
      return;
    }

    setIsClaiming(true);
    setClaimError('');
    setClaimSuccess(false);

    try {
      const response = await fetch('https://testnet-operator-evm.orderly.org/v1/faucet/usdc', {
        method: 'POST',
        headers: {
          // Standard headers
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6,ms;q=0.5,ja;q=0.4,ru;q=0.3,th;q=0.2,fr;q=0.1',
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json;charset=utf-8',
          'Pragma': 'no-cache',
          'Priority': 'u=1, i',
          
          // Orderly Network authentication headers
          'orderly-account-id': '0xdba37106030b22d10e10dbf65d0ae3c66d34ce71e998f6d008a43db6d560e25e',
          'orderly-key': 'ed25519:7CcAaf8vEnBKcEREzvSx6PuhPKpKmYVLW98hyncJztma',
          'orderly-signature': 'PlzKcnhelgwD-4WHD1QNpzdW216SlEMlBaNeG8mIX-cjvBEJbtRzYdHEGp_s9YXqrpep46nImiS4UMYAVIUiBA==',
          'orderly-timestamp': '1762359478106',
          
          // CORS headers
          'Origin': 'https://dex.orderly.network',
          'Referer': 'https://dex.orderly.network/',
          
          // Note: The following headers are automatically set by the browser and CANNOT be manually set:
          // - :authority (HTTP/2 pseudo-header, derived from URL)
          // - :method (HTTP/2 pseudo-header, derived from method: 'POST')
          // - :path (HTTP/2 pseudo-header, derived from URL path)
          // - :scheme (HTTP/2 pseudo-header, always 'https' for HTTPS URLs)
          // - Content-Length (automatically calculated from body)
          // - sec-ch-ua, sec-ch-ua-mobile, sec-ch-ua-platform (browser-controlled, forbidden to set)
          // - sec-fetch-dest, sec-fetch-mode, sec-fetch-site (browser-controlled, forbidden to set)
          // - User-Agent (browser-controlled, forbidden to set)
        },
        body: JSON.stringify({
          chain_id: '97',
          user_address: address,
          broker_id: 'demo'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Faucet request failed: ${response.status}`);
      }

      const data = await response.json();
      setClaimSuccess(true);
      setTimeout(() => setClaimSuccess(false), 5000); // Hide success message after 5 seconds
      
      // Refresh balances
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      console.error('Claim USDC error:', error);
      setClaimError(error.message || 'Failed to claim USDC. Please try again.');
    } finally {
      setIsClaiming(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white pb-20 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white pb-20">
        <div className="max-w-md mx-auto">
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-gray-900">SWAP RVM TOKEN</h1>
              {isConnected && address && (
                <div className="text-xs font-mono text-gray-500">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
              )}
            </div>
          </div>
          <div className="relative h-48 bg-gradient-to-r from-gray-800 to-gray-600 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <p className="text-3xl font-bold mb-2">BUY MORE</p>
                <p className="text-4xl font-bold">FREE MORE</p>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-3">
            {swapTiers.map((tier, index) => (
              <button
                key={index}
                onClick={() => setSelectedTier(index)}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between ${
                  selectedTier === index ? 'border-teal-500 bg-teal-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    selectedTier === index ? 'border-teal-500 bg-teal-500' : 'border-gray-300'
                  }`}></div>
                  <div className="text-left">
                    <p className="text-xs text-gray-600">TOTAL {tier.total}</p>
                    <p className="text-xl font-bold text-gray-900">
                      {tier.base} + {tier.bonus} <span className="text-sm font-normal text-gray-600">RVM</span>
                    </p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-teal-600">RVM</div>
              </button>
            ))}
          </div>

          {/* Balance Display */}
          {isConnected && address && (
            <div className="px-4 mb-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">Your Balance:</p>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedCurrency === 'BNB' && bnbBalance 
                      ? `${parseFloat(formatEther(bnbBalance.value)).toFixed(4)} BNB`
                      : selectedCurrency === 'USDT' && usdtBalance
                      ? `${parseFloat(formatEther(usdtBalance.value)).toFixed(2)} ${chainId === 97 ? 'USDC' : 'USDT'}`
                      : selectedCurrency === 'USD1' && usd1Balance
                      ? `${parseFloat(formatEther(usd1Balance.value)).toFixed(2)} USD1`
                      : 'Loading...'}
                  </p>
                </div>
                {selectedTier !== null && (
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">Required:</p>
                    <p className="text-sm font-bold text-teal-600">
                      {getRequiredAmount()} {selectedCurrency === 'USDT' && chainId === 97 ? 'USDC' : selectedCurrency}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Testnet Faucet - Claim Free USDC */}
          {isConnected && address && chainId === 97 && (
            <div className="px-4 mb-4">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-gray-900">Testnet Faucet</h3>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                    BSC Testnet Only
                  </span>
                </div>
                <p className="text-xs text-gray-700 mb-3">
                  Claim free USDC for testing on BSC Testnet
                </p>
                <button
                  onClick={handleClaimUSDC}
                  disabled={isClaiming}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:from-purple-600 hover:to-blue-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                >
                  {isClaiming ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Claiming...
                    </>
                  ) : (
                    <>
                      <Gift className="w-4 h-4" />
                      Claim Free USDC
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Claim Success Message */}
          {claimSuccess && (
            <div className="px-4 mb-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-900 mb-1">USDC Claimed Successfully!</p>
                  <p className="text-xs text-green-700">Check your wallet balance. Page will refresh in 2 seconds...</p>
                </div>
              </div>
            </div>
          )}

          {/* Claim Error Message */}
          {claimError && (
            <div className="px-4 mb-4">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900 mb-1">Faucet Claim Failed</p>
                  <p className="text-xs text-red-700">{claimError}</p>
                  <button
                    onClick={() => setClaimError('')}
                    className="text-xs text-red-600 hover:underline mt-2"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && swapStep === 'error' && (
            <div className="px-4 mb-4">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900 mb-1">Transaction Failed</p>
                  <p className="text-xs text-red-700">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {swapStep === 'success' && (
            <div className="px-4 mb-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-900 mb-1">Swap Successful!</p>
                  <p className="text-xs text-green-700">RVM tokens added to your wallet. Redirecting...</p>
                </div>
              </div>
            </div>
          )}

          {/* Approval Info */}
          {(selectedCurrency === 'USDT' || selectedCurrency === 'USD1') && swapStep === 'approving' && (
            <div className="px-4 mb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-xs text-blue-900 mb-2">
                  <strong>Step 1 of 2:</strong> Approve RVM contract to spend your {selectedCurrency === 'USDT' && chainId === 97 ? 'USDC' : selectedCurrency}
                </p>
                <p className="text-xs text-blue-700">
                  This is a one-time approval. You&apos;ll need to confirm in your wallet.
                </p>
              </div>
            </div>
          )}

          {/* Swap Button */}
          <div className="px-4 mb-6">
            <button 
              onClick={handleSwap}
              disabled={isLoading || selectedTier === null || !isConnected}
              className={`w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                swapStep === 'success' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : swapStep === 'error'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-teal-500 hover:bg-teal-600'
              } text-white`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  {getButtonText()}
                </>
              ) : swapStep === 'success' ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {getButtonText()}
                </>
              ) : swapStep === 'error' ? (
                <>
                  <AlertCircle className="w-5 h-5" />
                  {getButtonText()}
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  {getButtonText()}
                </>
              )}
            </button>
            
            {!isConnected && (
              <p className="text-center text-sm text-red-600 mt-2">
                Please connect your wallet to continue
              </p>
            )}
          </div>
          <div className="px-4 mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Swap with</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedCurrency('BNB')}
                className={`flex-1 p-4 rounded-2xl ${
                  selectedCurrency === 'BNB' ? 'bg-gray-900 border-2 border-teal-500' : 'bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center bg-yellow-400">
                  <Image src={`${basePath}/logos/bnb.png`} alt="BNB" width={48} height={48} className="rounded-full" />
                </div>
                <p className={`font-semibold ${selectedCurrency === 'BNB' ? 'text-white' : 'text-gray-900'}`}>BNB</p>
              </button>
              <button 
                onClick={() => setSelectedCurrency('USDT')}
                className={`flex-1 p-4 rounded-2xl ${
                  selectedCurrency === 'USDT' ? 'bg-gray-900 border-2 border-teal-500' : 'bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center bg-teal-500">
                  <Image src={`${basePath}/logos/usdt.png`} alt="USDT" width={48} height={48} className="rounded-full" />
                </div>
                <p className={`font-semibold ${selectedCurrency === 'USDT' ? 'text-white' : 'text-gray-900'}`}>USDT</p>
              </button>
              <button 
                onClick={() => setSelectedCurrency('USD1')}
                className={`flex-1 p-4 rounded-2xl ${
                  selectedCurrency === 'USD1' ? 'bg-gray-900 border-2 border-teal-500' : 'bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center bg-blue-500">
                  <span className="text-2xl font-bold text-white">$1</span>
                </div>
                <p className={`font-semibold ${selectedCurrency === 'USD1' ? 'text-white' : 'text-gray-900'}`}>USD1</p>
              </button>
            </div>
          </div>
          <div className="px-4 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Frequent Ask Question</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-2xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">How to use RVM Token</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  RVM tokens can be used for payments at participating merchants with automatic discounts applied at checkout.
                </p>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Where does RVM Token Use</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Use RVM tokens at any merchant in our marketplace for instant rewards and cashback benefits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
