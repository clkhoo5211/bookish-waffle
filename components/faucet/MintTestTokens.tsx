'use client';

import React, { useState } from 'react';
import { Coins, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

// Test Token Contract (you need to deploy this first)
const TEST_TOKEN_ADDRESS = (process.env.NEXT_PUBLIC_TEST_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`;

const TEST_TOKEN_ABI = [
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: []
  }
] as const;

export function MintTestTokens() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [mintAmount, setMintAmount] = useState('1000');
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isMinting, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // All hooks must be called before any conditional returns
  React.useEffect(() => {
    if (isSuccess) {
      setSuccess(true);
      setMinting(false);
      setTimeout(() => setSuccess(false), 5000);
    }
  }, [isSuccess]);

  const handleMint = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return;
    }

    setMinting(true);
    setError('');
    setSuccess(false);

    try {
      const amount = parseEther(mintAmount);
      
      writeContract({
        address: TEST_TOKEN_ADDRESS,
        abi: TEST_TOKEN_ABI,
        functionName: 'mint',
        args: [address, amount],
      });
    } catch (err: any) {
      console.error('Mint error:', err);
      setError(err.message || 'Failed to mint tokens');
      setMinting(false);
    }
  };

  // Check if test token is deployed
  const isTestTokenDeployed = TEST_TOKEN_ADDRESS !== '0x0000000000000000000000000000000000000000';

  // Only show on BSC Testnet
  if (chainId !== 97) {
    return null;
  }

  if (!isTestTokenDeployed) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-yellow-900 mb-2">Test Token Not Deployed</h3>
            <p className="text-sm text-yellow-800 mb-3">
              Deploy the TestToken.sol contract to enable instant test token minting.
            </p>
            <a
              href="https://remix.ethereum.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-yellow-700 underline hover:text-yellow-900"
            >
              Deploy with Remix IDE →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-green-600" />
          <h3 className="font-bold text-gray-900">Mint Test Tokens</h3>
        </div>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
          Instant & Unlimited
        </span>
      </div>
      
      <p className="text-xs text-gray-700 mb-3">
        Mint test tokens directly to your wallet. No waiting, no limits!
      </p>

      {/* Amount Input */}
      <div className="mb-3">
        <label className="text-xs text-gray-600 block mb-1">Amount to mint:</label>
        <input
          type="number"
          value={mintAmount}
          onChange={(e) => setMintAmount(e.target.value)}
          className="w-full px-3 py-2 border border-green-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="1000"
        />
      </div>

      {/* Mint Button */}
      <button
        onClick={handleMint}
        disabled={minting || isMinting || !isConnected}
        className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:from-green-600 hover:to-teal-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
      >
        {minting || isMinting ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            Minting...
          </>
        ) : (
          <>
            <Coins className="w-4 h-4" />
            Mint {mintAmount} Test Tokens
          </>
        )}
      </button>

      {/* Success Message */}
      {success && (
        <div className="mt-3 bg-green-100 border border-green-300 rounded-lg p-2 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <p className="text-xs text-green-800 font-semibold">
            Tokens minted successfully!
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 bg-red-100 border border-red-300 rounded-lg p-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <p className="text-xs text-red-800">{error}</p>
        </div>
      )}

      {/* Info */}
      <div className="mt-3 text-xs text-gray-600 space-y-1">
        <p>✅ Instant minting (no waiting)</p>
        <p>✅ Unlimited tokens</p>
        <p>✅ No verification required</p>
        <p>✅ Works every time</p>
      </div>
    </div>
  );
}

