'use client';

import { useEffect, useState } from 'react';
import { useAccount, useChainId, useSwitchChain, useDisconnect } from 'wagmi';
import { AlertCircle, RefreshCw, X } from 'lucide-react';

export function NetworkChecker() {
  const { isConnected, address, connector } = useAccount();
  const chainId = useChainId();
  const { chains, switchChain, isPending } = useSwitchChain();
  const { disconnect } = useDisconnect();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isAddingNetwork, setIsAddingNetwork] = useState(false);
  const [hasDisconnected, setHasDisconnected] = useState(false);

  const BSC_MAINNET_ID = 56; // BNB Smart Chain Mainnet
  const BSC_TESTNET_ID = 97; // BNB Smart Chain Testnet
  
  const isCorrectNetwork = chainId === BSC_MAINNET_ID || chainId === BSC_TESTNET_ID;

  // STRICT ENFORCEMENT: Auto-disconnect on wrong network
  useEffect(() => {
    if (isConnected && !isCorrectNetwork && !hasDisconnected) {
      console.warn(`❌ Wrong network detected: Chain ID ${chainId}. Disconnecting...`);
      setShowPrompt(true);
      
      // Auto-disconnect after 2 seconds if user doesn't switch
      const disconnectTimer = setTimeout(() => {
        if (!isCorrectNetwork) {
          disconnect();
          setHasDisconnected(true);
          console.warn('🔌 Wallet disconnected due to wrong network');
        }
      }, 3000);

      return () => clearTimeout(disconnectTimer);
    } else if (isCorrectNetwork) {
      setShowPrompt(false);
      setHasDisconnected(false);
    }
  }, [isConnected, isCorrectNetwork, chainId, disconnect, hasDisconnected]);

  const handleSwitchNetwork = async () => {
    try {
      // Switch to BSC Mainnet
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
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      alert('Please install a wallet like MetaMask to add networks.');
      return;
    }

    setIsAddingNetwork(true);
    try {
      // Add BSC Mainnet
      await ethereum.request({
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
    } catch (error: unknown) {
      console.error('Add network error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to add BNB Smart Chain. Please add it manually in your wallet settings. Error: ${errorMessage}`);
    } finally {
      setIsAddingNetwork(false);
    }
  };

  const handleDisconnectNow = () => {
    disconnect();
    setHasDisconnected(true);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <>
      {/* BLOCKING OVERLAY - Can't interact with app until network is correct */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" />
      
      {/* BLOCKING MODAL - Full screen, can't dismiss */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border-4 border-red-500 animate-pulse-slow">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 rounded-t-3xl">
            <div className="flex items-center gap-3 text-white">
              <div className="flex-shrink-0 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Wrong Network!</h2>
                <p className="text-white/90 text-sm mt-1">Action Required</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <p className="text-red-900 font-semibold mb-2">⛔ You are connected to the wrong network</p>
              <p className="text-red-700 text-sm">
                Current Network: <strong>Chain ID {chainId}</strong>
              </p>
            </div>

            <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-4">
              <p className="text-teal-900 font-semibold mb-2">✅ Required Network:</p>
              <p className="text-teal-700 text-sm">
                <strong>BNB Smart Chain (BSC)</strong>
              </p>
              <p className="text-teal-600 text-xs mt-1">
                Chain ID: 56 (Mainnet) or 97 (Testnet)
              </p>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <p className="text-yellow-900 font-semibold mb-2">⚠️ Wallet will auto-disconnect in 3 seconds</p>
              <p className="text-yellow-700 text-sm">
                Please switch your network now to continue using RVMPlus Dapps
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleSwitchNetwork}
                disabled={isPending || isAddingNetwork}
                className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold text-lg hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg"
              >
                {isPending || isAddingNetwork ? (
                  <>
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    Switching Network...
                  </>
                ) : (
                  <>
                    🔄 Switch to BNB Smart Chain
                  </>
                )}
              </button>

              <button
                onClick={handleDisconnectNow}
                className="w-full py-3 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Disconnect Wallet
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                💡 Tip: Set your wallet to BNB Smart Chain before connecting
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
