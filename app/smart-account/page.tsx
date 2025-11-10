'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId, useWalletClient, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useSmartAccountBackend } from '@/hooks/useSmartAccountBackend';
import { formatUnits, parseUnits, encodeFunctionData } from 'viem';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { BottomNav } from '@/components/ui/BottomNav';
import { ArrowLeft, Wallet, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createPublicClient, http } from 'viem';
import { createSmartAccountClient } from 'permissionless/clients';
import { toSimpleSmartAccount } from 'permissionless/accounts';
import { sepolia } from 'viem/chains';

const ENTRY_POINT = {
  address: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789' as `0x${string}`,
  version: '0.6' as const,
};

const SIMPLE_ACCOUNT_FACTORY =
  (process.env.NEXT_PUBLIC_SMART_ACCOUNT_FACTORY_ADDRESS as `0x${string}` | undefined) ??
  ('0x9406Cc6185a346906296840746125a0E44976454' as const);

const DEFAULT_RPC_URL =
  process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ?? 'https://rpc.sepolia.org';

const DEFAULT_PIMLICO_API_KEY =
  process.env.NEXT_PUBLIC_PIMLICO_API_KEY ?? 'pim_Yf1fPJzGN9U19FFyyvCfmd';

const DEFAULT_PIMLICO_BUNDLER_URL =
  process.env.NEXT_PUBLIC_PIMLICO_BUNDLER_URL ??
  `https://api.pimlico.io/v2/${sepolia.id}/rpc?apikey=${DEFAULT_PIMLICO_API_KEY}`;

const USDC_ADDRESS_SEPOLIA =
  (process.env.NEXT_PUBLIC_USDC_TESTNET_ADDRESS as `0x${string}` | undefined) ??
  ('0xcac524bca292aaade2df8a05cc58f0a65b1b3bb9' as const);

export default function SmartAccountPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient({ chainId });
  const isSepolia = chainId === 11155111;
  const tokenSymbol = 'USDC';
  const tokenDecimals = 6;
  const networkLabel = isSepolia ? 'Ethereum Sepolia' : chainId ? `Chain ${chainId}` : 'Unknown Network';
  const explorerBaseUrl = isSepolia ? 'https://sepolia.etherscan.io' : 'https://etherscan.io';
  const { writeContract, data: hash, isPending: isWriting } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  
  const {
    loading,
    error,
    createSmartAccount,
    getSmartAccount,
    checkConversionStatus,
    prepareConversion,
    checkWithdrawalStatus,
    prepareWithdrawal,
  } = useSmartAccountBackend();

  const [smartAccount, setSmartAccount] = useState<any>(null);
  const [conversionStatus, setConversionStatus] = useState<any>(null);
  const [withdrawalStatus, setWithdrawalStatus] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'convert' | 'withdraw'>('overview');
  const [convertAmount, setConvertAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawSubmitting, setWithdrawSubmitting] = useState(false);

  const loadSmartAccount = useCallback(async () => {
    const account = await getSmartAccount();
    setSmartAccount(account);
  }, [getSmartAccount]);

  const loadConversionStatus = useCallback(async () => {
    const status = await checkConversionStatus();
    setConversionStatus(status);
  }, [checkConversionStatus]);

  const loadWithdrawalStatus = useCallback(async () => {
    const status = await checkWithdrawalStatus();
    setWithdrawalStatus(status);
  }, [checkWithdrawalStatus]);

  // Load smart account on mount
  useEffect(() => {
    if (isConnected && address) {
      loadSmartAccount();
    }
  }, [isConnected, address, chainId, loadSmartAccount]);

  // Load status when smart account is available
  useEffect(() => {
    if (smartAccount) {
      loadConversionStatus();
      loadWithdrawalStatus();
    }
  }, [smartAccount, loadConversionStatus, loadWithdrawalStatus]);

  // Refresh after successful transaction
  useEffect(() => {
    if (isConfirmed) {
      setTimeout(() => {
        loadConversionStatus();
        loadWithdrawalStatus();
        setConvertAmount('');
      }, 2000);
    }
  }, [isConfirmed, loadConversionStatus, loadWithdrawalStatus]);

  const handleCreateSmartAccount = async () => {
    const account = await createSmartAccount();
    if (account) {
      setSmartAccount(account);
      await loadConversionStatus();
      await loadWithdrawalStatus();
    }
  };

  const handleConvert = async () => {
    if (!smartAccount) {
      alert('Please create a smart account first');
      return;
    }

    if (!conversionStatus?.hasUSDT) {
      alert('No USDC balance to convert');
      return;
    }

    const result = await prepareConversion(convertAmount || undefined);
    if (result?.transferTransaction) {
      // Sign and send the transaction
      try {
        const amount = convertAmount 
          ? parseUnits(convertAmount, tokenDecimals)
          : BigInt(conversionStatus.eoaUSDTBalance || '0');

        writeContract({
          address: result.transferTransaction.to as `0x${string}`,
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
          args: [
            smartAccount.smartAccountAddress,
            amount,
          ],
        });
      } catch (err) {
        console.error('Conversion error:', err);
        alert('Failed to convert. Please try again.');
      }
    } else {
      alert(result?.error || 'Failed to prepare conversion');
    }
  };

  const handleWithdraw = async () => {
    if (!smartAccount) {
      alert('Please create a smart account first');
      return;
    }

    if (!walletClient) {
      alert('Wallet client not available. Please reconnect your wallet.');
      return;
    }

    setWithdrawSubmitting(true);

    const result = await prepareWithdrawal(withdrawAmount || undefined, !withdrawAmount);

    if (!result?.success) {
      alert(result?.error || 'Failed to prepare withdrawal');
      setWithdrawSubmitting(false);
      return;
    }

    try {
      const publicClient = createPublicClient({
        chain: sepolia,
        transport: http(DEFAULT_RPC_URL),
      });

      const simpleAccount = await toSimpleSmartAccount({
        client: publicClient,
        owner: walletClient,
        factoryAddress: SIMPLE_ACCOUNT_FACTORY,
        entryPoint: ENTRY_POINT,
      });

      const smartAccountClient = createSmartAccountClient({
        account: simpleAccount,
        chain: sepolia,
        client: publicClient,
        bundlerTransport: http(DEFAULT_PIMLICO_BUNDLER_URL),
      });

      const amountToWithdraw =
        withdrawAmount && withdrawAmount.trim().length > 0
          ? parseUnits(withdrawAmount, tokenDecimals)
          : result.amount
            ? BigInt(result.amount)
            : withdrawalStatus?.smartAccountUSDTBalance
              ? BigInt(withdrawalStatus.smartAccountUSDTBalance)
              : 0n;

      if (amountToWithdraw <= 0n) {
        throw new Error('Invalid withdrawal amount');
      }

      const transferData = encodeFunctionData({
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
        args: [address as `0x${string}`, amountToWithdraw],
      });

      const userOpHash = await smartAccountClient.sendTransaction({
        calls: [
          {
            to: USDC_ADDRESS_SEPOLIA,
            data: transferData,
            value: 0n,
          },
        ],
      });

      setWithdrawSubmitting(false);
      alert(`Withdrawal submitted! UserOp hash: ${userOpHash}`);
      setWithdrawAmount('');

      smartAccountClient
        .waitForUserOperationReceipt({ hash: userOpHash })
        .then(async () => {
          await loadConversionStatus();
          await loadWithdrawalStatus();
        })
        .catch((receiptError) => {
          console.error('Error while waiting for withdrawal receipt:', receiptError);
        });
    } catch (err: any) {
      console.error('Withdrawal submission error:', err);
      alert(err?.message || 'Failed to submit withdrawal');
      setWithdrawSubmitting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto bg-white min-h-screen">
          <div className="p-6">
            <Link href="/" className="inline-flex items-center gap-2 text-teal-600 mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Wallet Not Connected</h2>
              <p className="text-gray-600 mb-6">Please connect your wallet to manage smart accounts</p>
              <Link href="/">
                <Button variant="primary">Connect Wallet</Button>
              </Link>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="p-6 pb-24">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="text-teal-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Smart Account</h1>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('convert')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'convert'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Convert
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'withdraw'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Withdraw
            </button>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Smart Account Status */}
              <Card>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Smart Account Status</h3>
                  {!smartAccount ? (
                    <div className="text-center py-6">
                      <p className="text-gray-600 mb-4">No smart account found</p>
                      <Button
                        onClick={handleCreateSmartAccount}
                        disabled={loading}
                        variant="primary"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Create Smart Account'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">EOA Address</span>
                        <Link
                          href={`${explorerBaseUrl}/address/${smartAccount.eoaAddress}`}
                          target="_blank"
                          className="text-sm font-mono text-teal-600 hover:underline"
                        >
                          {smartAccount.eoaAddress.slice(0, 6)}...{smartAccount.eoaAddress.slice(-4)}
                        </Link>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Smart Account</span>
                        <Link
                          href={`${explorerBaseUrl}/address/${smartAccount.smartAccountAddress}`}
                          target="_blank"
                          className="text-sm font-mono text-teal-600 hover:underline"
                        >
                          {smartAccount.smartAccountAddress.slice(0, 6)}...{smartAccount.smartAccountAddress.slice(-4)}
                        </Link>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <span className={`text-sm font-medium ${smartAccount.isDeployed ? 'text-green-600' : 'text-yellow-600'}`}>
                          {smartAccount.isDeployed ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              Deployed
                            </span>
                          ) : (
                            'Not Deployed'
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Chain</span>
                        <span className="text-sm font-medium text-gray-900">
                          {networkLabel}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Balances */}
              {smartAccount && conversionStatus && (
                <Card>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Balances</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">EOA {tokenSymbol}</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatUnits(BigInt(conversionStatus.eoaUSDTBalance ?? '0'), tokenDecimals)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Smart Account {tokenSymbol}</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatUnits(BigInt(conversionStatus.smartAccountUSDTBalance ?? '0'), tokenDecimals)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Smart Account ETH</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatUnits(BigInt(conversionStatus.smartAccountETHBalance ?? '0'), 18)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Convert Tab */}
          {activeTab === 'convert' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-teal-300 bg-teal-50 px-4 py-3 text-sm text-teal-700">
                Converting moves {tokenSymbol} from your connected wallet into the smart account. Use the
                Withdraw tab to move funds back to your wallet.
              </div>
              <div className="rounded-2xl bg-blue-50 px-4 py-3 text-blue-700">
                <strong>Wallet Balance:</strong>{' '}
                {conversionStatus
                  ? formatUnits(BigInt(conversionStatus.eoaUSDTBalance ?? '0'), tokenDecimals)
                  : '—'}{' '}
                {tokenSymbol}
              </div>
              <label className="block text-sm font-medium text-gray-600">
                Amount to move into the smart account (leave empty to transfer entire wallet balance)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="Enter amount"
                value={convertAmount}
                onChange={(e) => setConvertAmount(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-lg focus:border-teal-500 focus:outline-none"
              />
              <div className="mt-2 text-sm text-gray-500 space-y-1">
                <p>
                  <span className="font-semibold">Wallet Balance:</span>{' '}
                  {conversionStatus
                    ? formatUnits(BigInt(conversionStatus.eoaUSDTBalance ?? '0'), tokenDecimals)
                    : '—'}{' '}
                  {tokenSymbol}
                </p>
                <p>
                  <span className="font-semibold">Smart Account Balance:</span>{' '}
                  {conversionStatus
                    ? formatUnits(BigInt(conversionStatus.smartAccountUSDTBalance ?? '0'), tokenDecimals)
                    : '—'}{' '}
                  {tokenSymbol}
                </p>
                <p>
                  <span className="font-semibold">Smart Account ETH:</span>{' '}
                  {conversionStatus
                    ? formatUnits(BigInt(conversionStatus.smartAccountETHBalance ?? '0'), 18)
                    : '—'}{' '}
                  ETH
                </p>
              </div>
              <Button
                onClick={handleConvert}
                disabled={loading || isWriting || isConfirming || !conversionStatus?.hasUSDT}
                variant="primary"
                fullWidth
              >
                {isWriting || isConfirming ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : isConfirmed ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Converted!
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Convert {tokenSymbol}
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Withdraw Tab */}
          {activeTab === 'withdraw' && (
            <div className="space-y-4">
              <Card>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Withdraw from Smart Account</h3>
                  {!smartAccount ? (
                    <div className="text-center py-6">
                      <p className="text-gray-600 mb-4">Please create a smart account first</p>
                      <Button onClick={handleCreateSmartAccount} variant="primary">
                        Create Smart Account
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {withdrawalStatus && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-800 mb-2">
                            <strong>Smart Account Balance:</strong> {formatUnits(BigInt(withdrawalStatus.smartAccountUSDTBalance || '0'), tokenDecimals)} {tokenSymbol}
                          </p>
                          {!withdrawalStatus.hasGas && (
                            <p className="text-sm text-red-700">
                              ⚠️ Smart account has insufficient ETH for gas fees.
                            </p>
                          )}
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Amount to Withdraw (leave empty to withdraw all)
                        </label>
                        <input
                          type="text"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                      </div>
                      <Button
                        onClick={handleWithdraw}
                        disabled={loading || withdrawSubmitting || !withdrawalStatus?.canWithdraw}
                        variant="primary"
                        fullWidth
                      >
                        {loading || withdrawSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {withdrawSubmitting ? 'Submitting...' : 'Preparing...'}
                          </>
                        ) : (
                          <>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Withdraw {tokenSymbol}
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
        <BottomNav />
      </div>
    </div>
  );
}

