import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WalletState, WalletType } from '@/types/wallet';

interface WalletStore extends WalletState {
  connectWallet: (chainId: number, address: string, walletType: WalletType) => void;
  disconnectWallet: (chainId: number) => void;
  switchChain: (chainId: number) => void;
  setActiveChain: (chainId: number) => void;
  setConnectionStatus: (status: WalletState['connectionStatus']) => void;
}

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      connectedWallets: {},
      activeChain: 1, // Ethereum mainnet
      chains: [1, 137], // Ethereum, Polygon
      connectionStatus: 'disconnected',
      walletType: null,
      
      connectWallet: (chainId, address, walletType) =>
        set((state) => ({
          connectedWallets: { ...state.connectedWallets, [chainId]: address },
          activeChain: chainId,
          connectionStatus: 'connected',
          walletType,
        })),
      
      disconnectWallet: (chainId) =>
        set((state) => {
          const { [chainId]: _, ...rest } = state.connectedWallets;
          return {
            connectedWallets: rest,
            connectionStatus: Object.keys(rest).length === 0 ? 'disconnected' : 'connected',
            walletType: Object.keys(rest).length === 0 ? null : state.walletType,
          };
        }),
      
      switchChain: (chainId) =>
        set({ activeChain: chainId }),
      
      setActiveChain: (chainId) =>
        set({ activeChain: chainId }),
      
      setConnectionStatus: (status) =>
        set({ connectionStatus: status }),
    }),
    {
      name: 'rvm-wallet-storage',
    }
  )
);

