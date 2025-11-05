export type WalletType = 'metamask' | 'walletconnect' | 'privy' | 'coinbase' | null;

export interface WalletConnection {
  address: string;
  chainId: number;
  isConnected: boolean;
  walletType: WalletType;
}

export interface WalletState {
  connectedWallets: Record<number, string>; // chainId -> address
  activeChain: number;
  chains: number[];
  connectionStatus: 'disconnected' | 'connecting' | 'connected';
  walletType: WalletType;
}

