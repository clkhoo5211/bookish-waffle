'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { RefreshCw, CheckCircle, AlertCircle, Gift, CreditCard, Wallet, Lock } from 'lucide-react';
import { OnRampButton } from '@/components/onramp/OnRampButton';
import { ReownSwapButton } from '@/components/swap/ReownSwapButton';
import { MintTestTokens } from '@/components/faucet/MintTestTokens';
import { BottomNav } from '@/components/ui/BottomNav';
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';
import { parseEther, parseUnits, formatEther } from 'viem';
import { useReownLogin } from '@/hooks/useReownLogin';
import { bsc, bscTestnet, sepolia } from 'viem/chains';

// Get basePath for assets (GitHub Pages needs this)
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const swapTiers = [
  { total: 11000, base: 10000, bonus: 1000, priceInUSD: 100 }, // $100
  { total: 22200, base: 20000, bonus: 2200, priceInUSD: 200 }, // $200
  { total: 56000, base: 50000, bonus: 6000, priceInUSD: 500 }  // $500
];

// Contract addresses from environment variables
const TOKEN_ADDRESSES = {
  // BSC Mainnet USDT
  USDT_BSC: '0x55d398326f99059fF775485246999027B3197955' as `0x${string}`,
  // BSC Testnet USDC
  USDC_BSC_TESTNET: '0x31873b5804bABE258d6ea008f55e08DD00b7d51E' as `0x${string}`,
  // Pimlico Test USDT on Sepolia
  USDT_SEPOLIA: (process.env.NEXT_PUBLIC_USDT_TOKEN_ADDRESS || '0xd077a400968890eacc75cdc901f0356c943e4fdb') as `0x${string}`,
  USD1: (process.env.NEXT_PUBLIC_USD1_TOKEN_ADDRESS || '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82') as `0x${string}`,
  RVM_CONTRACT: (process.env.NEXT_PUBLIC_RVM_SWAP_CONTRACT || '0x0000000000000000000000000000000000000000') as `0x${string}`
};

// Get USDT address based on network
const getUSDTAddress = (chainId: number) => {
  if (chainId === sepolia.id) return TOKEN_ADDRESSES.USDT_SEPOLIA;
  if (chainId === bscTestnet.id) return TOKEN_ADDRESSES.USDC_BSC_TESTNET;
  return TOKEN_ADDRESSES.USDT_BSC;
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
type BuyOption = 'balance' | 'onramp' | 'faucet';

export default function SwapPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { open: openAppKit } = useAppKit();
  const { isReownConnected, requiresReownLogin } = useReownLogin();
  
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<'BNB' | 'USDT' | 'USD1'>('BNB');
  const [swapStep, setSwapStep] = useState<SwapStep>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [buyOption, setBuyOption] = useState<BuyOption | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Get balances
  const { data: bnbBalance, refetch: refetchBNB } = useBalance({ address });
  
  // USDT - dynamic based on network
  const { data: usdtBalance, refetch: refetchUSDT } = useBalance({ 
    address,
    token: getUSDTAddress(chainId)
  });
  
  const { data: usd1Balance, refetch: refetchUSD1 } = useBalance({ 
    address,
    token: TOKEN_ADDRESSES.USD1
  });

  // Refetch all balances
  const refetchBalances = () => {
    refetchBNB();
    refetchUSDT();
    refetchUSD1();
  };

  // Contract write hooks
  const { 
    writeContract: approveToken,
    data: approveHash,
    isPending: isApprovePending,
    error: approveError
  } = useWriteContract();

  const { 
    writeContract: executeSwap,
    data: swapHash,
    isPending: isSwapPending,
    error: swapError
  } = useWriteContract();

  // Wait for transactions
  const { isLoading: isApproveLoading, isSuccess: isApproveSuccess, isError: isApproveError } = useWaitForTransactionReceipt({
    hash: approveHash,
  });

  const { isLoading: isSwapLoading, isSuccess: isSwapSuccess, isError: isSwapError } = useWaitForTransactionReceipt({
    hash: swapHash,
  });

  // Calculate required amount based on selected tier and currency
  const getRequiredAmount = () => {
    if (selectedTier === null) return '0';
    const tier = swapTiers[selectedTier];
    
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

  // Get current balance for selected currency
  const getCurrentBalance = () => {
    switch (selectedCurrency) {
      case 'BNB':
        return bnbBalance ? parseFloat(formatEther(bnbBalance.value)) : 0;
      case 'USDT':
        // Pimlico USDT on Sepolia uses 6 decimals, others use 18
        if (chainId === sepolia.id && usdtBalance) {
          return parseFloat((Number(usdtBalance.value) / 1e6).toFixed(2));
        }
        return usdtBalance ? parseFloat(formatEther(usdtBalance.value)) : 0;
      case 'USD1':
        return usd1Balance ? parseFloat(formatEther(usd1Balance.value)) : 0;
      default:
        return 0;
    }
  };

  // Check if balance is sufficient
  const isBalanceSufficient = () => {
    const currentBalance = getCurrentBalance();
    const requiredAmount = parseFloat(getRequiredAmount());
    return currentBalance >= requiredAmount;
  };

  // Handle login requirement
  const handleLoginRequired = () => {
    if (requiresReownLogin) {
      openAppKit();
      return true;
    }
    return false;
  };

  // Handle swap with proper flow
  const handleSwap = async () => {
    // Step 1: Check Reown login
    if (!isConnected || !address) {
      setErrorMessage('Please connect your wallet first');
      if (handleLoginRequired()) return;
      setSwapStep('error');
      return;
    }

    if (!isReownConnected) {
      setErrorMessage('Please login using Reown (email/social login) to use this feature');
      openAppKit();
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

      const requiredAmount = parseFloat(getRequiredAmount());
      const currentBalance = getCurrentBalance();

      // Step 2: Check balance
      if (currentBalance < requiredAmount) {
        // Insufficient balance - show buy options
        setShowBuyModal(true);
        setBuyOption('onramp'); // Default to on-ramp
        setSwapStep('idle');
        return;
      }

      // Step 3: Balance sufficient - proceed with swap
      await performSwap();

    } catch (error: any) {
      console.error('Swap error:', error);
      setErrorMessage(error.message || 'Transaction failed');
      setSwapStep('error');
    }
  };

  const performSwap = async () => {
    setSwapStep('swapping');
    
    try {
      const tier = swapTiers[selectedTier!];
      const requiredAmount = getRequiredAmount();
      
      // For ERC-20 tokens, check and handle approval
      if (selectedCurrency === 'USDT' || selectedCurrency === 'USD1') {
        setSwapStep('approving');
        
        const tokenAddress = selectedCurrency === 'USDT' 
          ? getUSDTAddress(chainId)
          : TOKEN_ADDRESSES.USD1;
        const amountToApprove = parseUnits(requiredAmount, 18);
        
        approveToken({
          address: tokenAddress,
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [TOKEN_ADDRESSES.RVM_CONTRACT, amountToApprove],
        });
      } else {
        // For BNB, proceed directly to swap
        // In production, you would call:
        // executeSwap({
        //   address: TOKEN_ADDRESSES.RVM_CONTRACT,
        //   abi: RVM_CONTRACT_ABI,
        //   functionName: 'swap',
        //   args: [selectedCurrency, parseUnits(requiredAmount, 18), tier.total],
        //   value: parseEther(requiredAmount)
        // });
        
        // Mock for now
        await new Promise(resolve => setTimeout(resolve, 2000));
        setSwapStep('success');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
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

  // Effect to handle approval error/cancellation
  useEffect(() => {
    if (approveError || isApproveError) {
      console.log('Approval cancelled or failed:', approveError);
      setErrorMessage('Transaction cancelled or failed. Please try again.');
      setSwapStep('error');
      setTimeout(() => {
        setSwapStep('idle');
        setErrorMessage('');
      }, 3000);
    }
  }, [approveError, isApproveError]);

  // Effect to handle swap error/cancellation
  useEffect(() => {
    if (swapError || isSwapError) {
      console.log('Swap cancelled or failed:', swapError);
      setErrorMessage('Transaction cancelled or failed. Please try again.');
      setSwapStep('error');
      setTimeout(() => {
        setSwapStep('idle');
        setErrorMessage('');
      }, 3000);
    }
  }, [swapError, isSwapError]);

  // Handle on-ramp purchase
  const handleOnRamp = () => {
    if (!isReownConnected) {
      openAppKit();
      return;
    }
    
    // Open Reown on-ramp modal
    // The OnRampButton component handles the modal opening
    setShowBuyModal(false);
  };

  const getButtonText = () => {
    if (!isReownConnected) {
      return 'Login with Reown to Continue';
    }
    
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

  // Reown login required screen
  if (!isReownConnected || !isConnected) {
    return (
      <>
        <div className="min-h-screen bg-white pb-20 flex items-center justify-center">
          <div className="max-w-md mx-auto px-4">
            <div className="text-center mb-8">
              <Lock className="w-16 h-16 text-teal-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h1>
              <p className="text-gray-600 mb-6">
                Please login with Reown to access swap, on-ramp, and faucet features.
              </p>
              <button
                onClick={() => openAppKit()}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all"
              >
                <Wallet className="w-5 h-5" />
                Login with Reown
              </button>
              <p className="text-sm text-gray-500 mt-4">
                Login with email, Google, Apple, X, or Discord to continue
              </p>
            </div>
          </div>
        </div>
        <BottomNav />
      </>
    );
  }

  const currentBalance = getCurrentBalance();
  const requiredAmount = parseFloat(getRequiredAmount());
  const balanceSufficient = isBalanceSufficient();

  return (
    <>
      <div className="bg-white pb-20">
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

          {/* Swap Tiers */}
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

          {/* Network Warning for USDT */}
          {isConnected && selectedCurrency === 'USDT' && chainId !== sepolia.id && chainId !== bscTestnet.id && chainId !== bsc.id && (
            <div className="px-4 mb-4">
              <div className="bg-orange-50 border-2 border-orange-300 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-bold text-orange-900 mb-2">Wrong Network for USDT</h3>
                    <p className="text-sm text-orange-800 mb-3">
                      Smart Accounts are per-network. To use Sepolia USDT:
                    </p>
                    <div className="space-y-2">
                      <button
                        onClick={() => openAppKit({ view: 'Networks' })}
                        className="w-full bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-orange-700 transition-all flex items-center justify-center gap-2"
                      >
                        🌐 Open Network Selector
                      </button>
                    </div>
                    <div className="bg-white rounded-lg p-3 mt-3 text-xs text-orange-800">
                      <p className="font-semibold mb-1">📝 How to switch:</p>
                      <p>1. Click button above</p>
                      <p>2. Select &ldquo;Sepolia&rdquo; network</p>
                      <p>3. Disconnect current account</p>
                      <p>4. Login with Google again on Sepolia</p>
                      <p className="mt-2 text-green-700 font-semibold">
                        ✅ You&apos;ll see your 1,000 USDT on Sepolia
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Balance Display */}
          {isConnected && address && (
            <div className="px-4 mb-4">
              <div className={`rounded-2xl p-4 ${
                balanceSufficient ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
              }`}>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">Your Balance:</p>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedCurrency === 'BNB' && bnbBalance 
                      ? `${parseFloat(formatEther(bnbBalance.value)).toFixed(4)} BNB`
                      : selectedCurrency === 'USDT' && usdtBalance
                      ? chainId === sepolia.id 
                        ? `${(Number(usdtBalance.value) / 1e6).toFixed(2)} USDT (Sepolia)`
                        : `${parseFloat(formatEther(usdtBalance.value)).toFixed(2)} USDT`
                      : selectedCurrency === 'USD1' && usd1Balance
                      ? `${parseFloat(formatEther(usd1Balance.value)).toFixed(2)} USD1`
                      : '0.00'}
                  </p>
                </div>
                {selectedTier !== null && (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-600">Required:</p>
                      <p className={`text-sm font-bold ${
                        balanceSufficient ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {getRequiredAmount()} {selectedCurrency}
                      </p>
                    </div>
                    {!balanceSufficient && (
                      <div className="mt-2 p-2 bg-white rounded-lg">
                        <p className="text-xs text-yellow-700">
                          ⚠️ Insufficient balance. You need {requiredAmount - currentBalance} more {selectedCurrency}
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Mint Test Tokens (BSC Testnet Only) */}
          {isConnected && address && chainId === bscTestnet.id && (
            <div className="px-4 mb-4">
              <MintTestTokens />
            </div>
          )}

          {/* Faucet Section (Testnet Only) */}
          {isConnected && address && (chainId === bscTestnet.id || chainId === sepolia.id) && (
            <div className="px-4 mb-4">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Gift className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-gray-900">Get Free Test Tokens</h3>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                    BSC Testnet Only
                  </span>
                </div>
                <p className="text-xs text-gray-700 mb-3">
                  Multiple faucets available - choose any to get free test tokens
                </p>
                
                <div className="space-y-2 mb-3">
                  <a
                    href="https://www.bnbchain.org/en/testnet-faucet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white border-2 border-purple-200 text-purple-700 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-purple-50 transition-all flex items-center justify-center gap-2"
                  >
                    🏛️ BNB Chain Official Faucet
                  </a>
                  <a
                    href="https://faucet.quicknode.com/binance/bnb-testnet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white border-2 border-blue-200 text-blue-700 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                  >
                    ⚡ QuickNode Faucet
                  </a>
                  <a
                    href="https://testnet.binance.org/faucet-smart"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white border-2 border-green-200 text-green-700 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                  >
                    🌐 Testnet.Binance.org
                  </a>
                </div>

                <div className="bg-white rounded-lg p-2 border border-purple-100">
                  <p className="text-xs text-gray-600 mb-1">Your Address (copy this):</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-mono text-gray-900 truncate flex-1">
                      {address}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(address);
                        alert('Address copied!');
                      }}
                      className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-semibold hover:bg-purple-200 transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Buy Modal (Insufficient Balance) */}
          {showBuyModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Insufficient Balance</h3>
                <p className="text-sm text-gray-600 mb-4">
                  You need {requiredAmount} {selectedCurrency} but only have {currentBalance.toFixed(4)}.
                </p>
                
                <div className="space-y-3 mb-4">
                  {/* Reown Swap - Exchange tokens */}
                  <ReownSwapButton toToken={selectedCurrency} />
                  
                  {/* On-Ramp - Buy with credit card */}
                  <OnRampButton 
                    token={selectedCurrency}
                    amount={requiredAmount.toString()}
                  />
                  
                  {/* Receive - Open receive view */}
                  <button
                    onClick={() => {
                      setShowBuyModal(false);
                      openAppKit({ view: 'Account' });
                    }}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-green-600 hover:to-teal-600 transition-all"
                  >
                    <Wallet className="w-5 h-5" />
                    Receive {selectedCurrency}
                  </button>
                  
                  {/* Faucet - Only on testnet */}
                  {(chainId === bscTestnet.id || chainId === sepolia.id) && (
                    <button
                      onClick={() => {
                        setBuyOption('faucet');
                        setShowBuyModal(false);
                        // Scroll to faucet section
                        document.getElementById('faucet-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-purple-600 hover:to-indigo-600 transition-all"
                    >
                      <Gift className="w-5 h-5" />
                      Get Free Test Tokens (Testnet)
                    </button>
                  )}
                </div>
                
                <button
                  onClick={() => setShowBuyModal(false)}
                  className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
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
                  <strong>Step 1 of 2:</strong> Approve RVM contract to spend your {selectedCurrency}
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
                  : !isReownConnected
                  ? 'bg-gray-400 hover:bg-gray-500'
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
          </div>

          {/* Currency Selection */}
          <div className="px-4 mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Swap with</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedCurrency('BNB')}
                className={`flex-1 p-4 rounded-2xl ${
                  selectedCurrency === 'BNB' ? 'bg-gray-900 border-2 border-teal-500' : 'bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center overflow-hidden">
                  <Image 
                    src={`${basePath}/logos/bnb.png`} 
                    alt="BNB" 
                    width={48} 
                    height={48} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className={`font-semibold ${selectedCurrency === 'BNB' ? 'text-white' : 'text-gray-900'}`}>BNB</p>
              </button>
              <button 
                onClick={() => setSelectedCurrency('USDT')}
                className={`flex-1 p-4 rounded-2xl ${
                  selectedCurrency === 'USDT' ? 'bg-gray-900 border-2 border-teal-500' : 'bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center overflow-hidden">
                  <Image 
                    src={`${basePath}/logos/usdt.png`} 
                    alt="USDT" 
                    width={48} 
                    height={48}
                    className="w-full h-full object-cover"
                  />
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

          {/* FAQ Section */}
          <div className="px-4 mb-6" id="faucet-section">
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
