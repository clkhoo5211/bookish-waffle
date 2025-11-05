'use client';

import React, { useState, useEffect } from 'react';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { usePrivy } from '@privy-io/react-auth';
import { useAppKit } from '@reown/appkit/react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useUIStore } from '@/store';

export const ConnectWallet: React.FC = () => {
  const { connect, connectors, isPending } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { ready, authenticated, login, logout } = usePrivy();
  const { open: openAppKit } = useAppKit(); // Reown AppKit modal
  const { openModal, closeModal, modals } = useUIStore();
  const isModalOpen = modals['connect-wallet'] || false;
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConnect = async (walletType: 'metamask' | 'walletconnect' | 'privy') => {
    try {
      if (walletType === 'privy' && ready) {
        // Use Privy login
        if (!authenticated) {
          await login();
        }
      } else if (walletType === 'walletconnect') {
        // Use Reown AppKit modal for WalletConnect
        closeModal('connect-wallet');
        openAppKit();
      } else {
        // Use wagmi for MetaMask
        const connector = connectors.find((c) => {
          if (walletType === 'metamask') return c.id === 'metaMask' || c.id === 'io.metamask';
          return false;
        });
        if (connector) {
          connect({ connector });
        }
      }
      if (walletType !== 'walletconnect') {
        closeModal('connect-wallet');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  };

  const handleDisconnect = () => {
    if (authenticated) {
      logout();
    } else {
      disconnect();
    }
  };

  // Show loading state until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="primary" disabled>
        Loading...
      </Button>
    );
  }

  if (isConnected || authenticated) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#1e293c] font-medium bg-[#f1f5f9] px-3 py-2 rounded-lg">
          {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
        </span>
        <Button variant="outline" size="sm" onClick={handleDisconnect}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button onClick={() => openModal('connect-wallet')} variant="primary">
        Connect Wallet
      </Button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => closeModal('connect-wallet')}
        title="Connect Wallet"
        size="md"
      >
        <div className="space-y-3">
          <Button
            variant="outline"
            fullWidth
            onClick={() => handleConnect('privy')}
            disabled={!ready || isPending}
            className="!justify-start !h-auto !py-4"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#00a19c]/10 flex items-center justify-center">
                  <span className="text-xl">🔐</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-[#1e293c]">Privy Wallet</div>
                  <div className="text-xs text-gray-500">Embedded • Email & Social</div>
                </div>
              </div>
            </div>
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => handleConnect('metamask')}
            disabled={isPending}
            className="!justify-start !h-auto !py-4"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#f3ba2f]/10 flex items-center justify-center">
                  <span className="text-xl">🦊</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-[#1e293c]">MetaMask</div>
                  <div className="text-xs text-gray-500">External • Browser Extension</div>
                </div>
              </div>
            </div>
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => handleConnect('walletconnect')}
            disabled={isPending}
            className="!justify-start !h-auto !py-4"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#00a19c]/10 flex items-center justify-center">
                  <span className="text-xl">🔗</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-[#1e293c]">WalletConnect</div>
                  <div className="text-xs text-gray-500">External • 300+ Wallets via QR</div>
                </div>
              </div>
            </div>
          </Button>
        </div>
        <div className="mt-4 text-center text-xs text-gray-500">
          <p>By connecting, you agree to our Terms of Service</p>
        </div>
      </Modal>
    </>
  );
};
