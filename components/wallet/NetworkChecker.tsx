'use client';

import { useEffect, useState } from 'react';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { AlertCircle, RefreshCw } from 'lucide-react';

// Extend Window interface for Ethereum provider
declare global {
  interface Window {
    ethereum?: any;
  }
}

export function NetworkChecker() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { chains, switchChain, isPending } = useSwitchChain();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isAddingNetwork, setIsAddingNetwork] = useState(false);

  const BSC_MAINNET_ID = 56; // BNB Smart Chain Mainnet
  const BSC_TESTNET_ID = 97; // BNB Smart Chain Testnet
  const isCorrectNetwork = chainId === BSC_MAINNET_ID || chainId === BSC_TESTNET_ID;

  useEffect(() => {
    if (isConnected && !isCorrectNetwork) {
      setShowPrompt(true);
    } else {
      setShowPrompt(false);
    }
  }, [isConnected, isCorrectNetwork]);

  const handleSwitchNetwork = async () => {
    try {
      // Try to switch to BSC Mainnet using wagmi (production)
      if (switchChain) {
        switchChain({ chainId: BSC_MAINNET_ID });
      }
    } catch (error: any) {
      console.error('Switch network error:', error);
      
      // If switching fails, try to add the network manually
      if (error.code === 4902 || error.message?.includes('Unrecognized chain')) {
        await handleAddNetwork();
      }
    }
  };

  const handleAddNetwork = async () => {
    setIsAddingNetwork(true);
    try {
      // Add BSC Mainnet to wallet
      await window.ethereum?.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x38', // 56 in hex (BSC Mainnet)
            chainName: 'BNB Smart Chain',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'BNB',
              decimals: 18,
            },
            rpcUrls: [
              'https://bsc-dataseed.binance.org',
              'https://bsc.publicnode.com',
              'https://56.rpc.thirdweb.com'
            ],
            blockExplorerUrls: ['https://bscscan.com/'],
          },
        ],
      });
      setShowPrompt(false);
    } catch (error: any) {
      console.error('Add network error:', error);
      alert('Failed to add BNB Smart Chain. Please add it manually in your wallet settings.');
    } finally {
      setIsAddingNetwork(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-2xl p-4 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Wrong Network Detected</h3>
              <p className="text-sm text-gray-700 mb-3">
                Please switch to <strong>BNB Smart Chain</strong> to use RVMPlus Dapps.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleSwitchNetwork}
                  disabled={isPending || isAddingNetwork}
                  className="flex-1 bg-teal-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending || isAddingNetwork ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Switching...
                    </>
                  ) : (
                    <>
                      Switch Network
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowPrompt(false)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

