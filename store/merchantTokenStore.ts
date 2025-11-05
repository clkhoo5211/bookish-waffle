import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MerchantToken } from '@/types/merchant';

interface MerchantTokenStore {
  // Merchant Tokens
  merchantTokens: MerchantToken[];
  setMerchantTokens: (tokens: MerchantToken[]) => void;
  addMerchantToken: (token: MerchantToken) => void;
  updateMerchantTokenBalance: (merchantId: string, amount: number) => void;
  
  // Calculations
  getTotalTokens: () => number;
  getTotalEstimatedValue: () => number;
  
  // Search & Filter
  searchMerchantTokens: (query: string) => MerchantToken[];
}

export const useMerchantTokenStore = create<MerchantTokenStore>()(
  persist(
    (set, get) => ({
      merchantTokens: [
        {
          merchantId: 'merchant-1',
          merchantName: 'The Roasted Bean Coffee Co.',
          merchantLogo: '☕',
          tokenSymbol: 'TRBCC',
          balance: 150.75,
          lastUpdated: Date.now() - 300000, // 5 minutes ago
          estimatedValueRM: 45.00,
        },
        {
          merchantId: 'merchant-2',
          merchantName: 'Nas Fish n Chips',
          merchantLogo: '🍟',
          tokenSymbol: 'NFCT',
          balance: 85.00,
          lastUpdated: Date.now() - 600000, // 10 minutes ago
          estimatedValueRM: 25.50,
        },
        {
          merchantId: 'merchant-3',
          merchantName: 'The Roasted Bean Coffee Co.',
          merchantLogo: '☕',
          tokenSymbol: 'TRBCC',
          balance: 120.00,
          lastUpdated: Date.now() - 900000, // 15 minutes ago
          estimatedValueRM: 36.00,
        },
        {
          merchantId: 'merchant-4',
          merchantName: 'The Roasted Bean Coffee Co.',
          merchantLogo: '☕',
          tokenSymbol: 'TRBCC',
          balance: 95.25,
          lastUpdated: Date.now() - 1200000, // 20 minutes ago
          estimatedValueRM: 28.50,
        },
      ],
      
      setMerchantTokens: (tokens) => set({ merchantTokens: tokens }),
      
      addMerchantToken: (token) =>
        set((state) => ({
          merchantTokens: [token, ...state.merchantTokens],
        })),
      
      updateMerchantTokenBalance: (merchantId, amount) =>
        set((state) => ({
          merchantTokens: state.merchantTokens.map((token) =>
            token.merchantId === merchantId
              ? { ...token, balance: token.balance + amount, lastUpdated: Date.now() }
              : token
          ),
        })),
      
      getTotalTokens: () => {
        const uniqueMerchants = new Set(get().merchantTokens.map(t => t.merchantId));
        return uniqueMerchants.size;
      },
      
      getTotalEstimatedValue: () => {
        return get().merchantTokens.reduce((sum, token) => sum + token.estimatedValueRM, 0);
      },
      
      searchMerchantTokens: (query) => {
        if (!query) return get().merchantTokens;
        const lowerQuery = query.toLowerCase();
        return get().merchantTokens.filter(
          (token) =>
            token.merchantName.toLowerCase().includes(lowerQuery) ||
            token.tokenSymbol.toLowerCase().includes(lowerQuery)
        );
      },
    }),
    {
      name: 'merchant-token-store',
    }
  )
);

