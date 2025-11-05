import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { RVMBalance, RVMTokenPackage, BNBReward, RVMTransaction } from '@/types/rvm';

interface RVMStore {
  // RVM Balance
  rvmBalance: RVMBalance;
  setRVMBalance: (balance: RVMBalance) => void;
  updateRVMBalance: (amount: number) => void;
  
  // BNB Rewards
  bnbReward: BNBReward;
  setBNBReward: (reward: BNBReward) => void;
  addBNBReward: (amount: number) => void;
  
  // Token Packages
  tokenPackages: RVMTokenPackage[];
  setTokenPackages: (packages: RVMTokenPackage[]) => void;
  
  // Transactions
  rvmTransactions: RVMTransaction[];
  addRVMTransaction: (transaction: RVMTransaction) => void;
  
  // Purchase
  purchaseRVM: (packageId: string, paymentMethod: string) => Promise<void>;
}

export const useRVMStore = create<RVMStore>()(
  persist(
    (set, get) => ({
      rvmBalance: {
        balance: 57789.00,
        rewards: 400.68,
        change24h: 400.68,
        changePercent: 12.3,
      },
      setRVMBalance: (balance) => set({ rvmBalance: balance }),
      updateRVMBalance: (amount) =>
        set((state) => ({
          rvmBalance: {
            ...state.rvmBalance,
            balance: state.rvmBalance.balance + amount,
          },
        })),
      
      bnbReward: {
        total: 0.00010,
        lastUpdate: Date.now() - 86400000, // 1 day ago
      },
      setBNBReward: (reward) => set({ bnbReward: reward }),
      addBNBReward: (amount) =>
        set((state) => ({
          bnbReward: {
            total: state.bnbReward.total + amount,
            lastUpdate: Date.now(),
          },
        })),
      
      tokenPackages: [
        {
          id: 'pkg-1',
          base: 10000,
          bonus: 1000,
          total: 11000,
          price: { bnb: 0.5, usdt: 150, cake: 300 },
        },
        {
          id: 'pkg-2',
          base: 20000,
          bonus: 2200,
          total: 22200,
          price: { bnb: 1.0, usdt: 290, cake: 580 },
        },
        {
          id: 'pkg-3',
          base: 50000,
          bonus: 6000,
          total: 56000,
          price: { bnb: 2.3, usdt: 690, cake: 1380 },
        },
      ],
      setTokenPackages: (packages) => set({ tokenPackages: packages }),
      
      rvmTransactions: [],
      addRVMTransaction: (transaction) =>
        set((state) => ({
          rvmTransactions: [transaction, ...state.rvmTransactions],
        })),
      
      purchaseRVM: async (packageId, paymentMethod) => {
        const pkg = get().tokenPackages.find((p) => p.id === packageId);
        if (!pkg) return;
        
        // TODO: Implement actual blockchain purchase
        const transaction: RVMTransaction = {
          id: `rvm-tx-${Date.now()}`,
          type: 'purchase',
          amount: pkg.total,
          currency: paymentMethod,
          timestamp: Date.now(),
          status: 'pending',
        };
        
        get().addRVMTransaction(transaction);
        
        // Simulate async purchase
        setTimeout(() => {
          get().updateRVMBalance(pkg.total);
          set((state) => ({
            rvmTransactions: state.rvmTransactions.map((tx) =>
              tx.id === transaction.id ? { ...tx, status: 'confirmed' as const } : tx
            ),
          }));
        }, 2000);
      },
    }),
    {
      name: 'rvm-store',
    }
  )
);

