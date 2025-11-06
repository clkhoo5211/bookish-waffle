'use client';

import React, { useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { Gift, ExternalLink, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface FaucetOption {
  name: string;
  url: string;
  tokens: string[];
  description: string;
  method: 'web' | 'api';
  apiEndpoint?: string;
}

const FAUCET_OPTIONS: FaucetOption[] = [
  {
    name: 'BNB Chain Official Faucet',
    url: 'https://www.bnbchain.org/en/testnet-faucet',
    tokens: ['BNB'],
    description: 'Get 0.1-1.0 test BNB. Most reliable.',
    method: 'web',
  },
  {
    name: 'QuickNode Faucet',
    url: 'https://faucet.quicknode.com/binance/bnb-testnet',
    tokens: ['BNB', 'BUSD'],
    description: 'Fast and reliable. Get BNB + tokens.',
    method: 'web',
  },
  {
    name: 'Testnet.Binance.org',
    url: 'https://testnet.binance.org/faucet-smart',
    tokens: ['BNB', 'USDT', 'BUSD'],
    description: 'Official Binance testnet faucet.',
    method: 'web',
  },
  {
    name: 'Chainlink Faucet',
    url: 'https://faucets.chain.link/bnb-testnet',
    tokens: ['BNB', 'LINK'],
    description: 'Get test BNB and LINK tokens.',
    method: 'web',
  },
];

export function MultiFaucet() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Only show on BSC Testnet
  if (chainId !== 97) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-yellow-900 mb-1">Switch to BSC Testnet</h3>
            <p className="text-sm text-yellow-700">
              Faucets are only available on BSC Testnet (Chain ID 97). Please switch networks.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-purple-600" />
            <h3 className="font-bold text-gray-900 text-lg">Free Testnet Tokens</h3>
          </div>
          <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
            BSC Testnet
          </span>
        </div>
        <p className="text-sm text-gray-700 mb-3">
          Get free test tokens from multiple faucets. No real money involved!
        </p>

        {/* Wallet Address Display */}
        {isConnected && address && (
          <div className="bg-white rounded-xl p-3 border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Your Wallet Address:</p>
                <p className="text-sm font-mono text-gray-900 break-all">
                  {address}
                </p>
              </div>
              <button
                onClick={handleCopyAddress}
                className="ml-2 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              >
                {copiedAddress ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    Copied!
                  </>
                ) : (
                  <>Copy</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Faucet Options */}
      <div className="space-y-3">
        {FAUCET_OPTIONS.map((faucet, index) => (
          <div
            key={index}
            className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-purple-300 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 mb-1">{faucet.name}</h4>
                <p className="text-xs text-gray-600 mb-2">{faucet.description}</p>
                
                {/* Tokens */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {faucet.tokens.map((token, i) => (
                    <span
                      key={i}
                      className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold"
                    >
                      {token}
                    </span>
                  ))}
                </div>

                {/* Instructions */}
                <div className="text-xs text-gray-500 space-y-1">
                  <p>1. Click &ldquo;Visit Faucet&rdquo; below</p>
                  <p>2. {address ? 'Paste your address (copied above)' : 'Connect wallet first, then copy address'}</p>
                  <p>3. Complete verification (if required)</p>
                  <p>4. Receive free test tokens!</p>
                </div>
              </div>

              {/* Visit Button */}
              <a
                href={faucet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:from-purple-600 hover:to-blue-600 transition-all flex items-center gap-2 shadow-md whitespace-nowrap"
              >
                Visit Faucet
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Troubleshooting
        </h4>
        <ul className="text-sm text-blue-800 space-y-1 ml-6">
          <li className="list-disc">If a faucet is down, try another one</li>
          <li className="list-disc">Some faucets have daily limits</li>
          <li className="list-disc">Wait times vary (instant to 30 seconds)</li>
          <li className="list-disc">Tokens appear in your wallet automatically</li>
          <li className="list-disc">Still need tokens? Ask in BSC Discord/Telegram</li>
        </ul>
      </div>

      {/* Community Alternative */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <h4 className="font-bold text-gray-900 mb-2">Need More Help?</h4>
        <p className="text-sm text-gray-700 mb-3">
          If all faucets are down or rate-limited, join the BSC community:
        </p>
        <div className="flex flex-wrap gap-2">
          <a
            href="https://discord.gg/bnbchain"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-600 transition-colors"
          >
            BSC Discord
          </a>
          <a
            href="https://t.me/BNBchaincommunity"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
          >
            BSC Telegram
          </a>
        </div>
      </div>
    </div>
  );
}

