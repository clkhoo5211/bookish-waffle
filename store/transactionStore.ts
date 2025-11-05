import { create } from 'zustand';
import type { Transaction, TransactionStatus } from '@/types/transaction';

interface TransactionStore {
  pendingTransactions: Transaction[];
  transactionHistory: Transaction[];
  currentTransaction: Transaction | null;
  transactionStatus: 'idle' | 'signing' | 'pending' | 'confirmed' | 'failed';
  
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (hash: string, updates: Partial<Transaction>) => void;
  setCurrentTransaction: (transaction: Transaction | null) => void;
  setTransactionStatus: (status: TransactionStore['transactionStatus']) => void;
  clearPendingTransactions: () => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  pendingTransactions: [],
  transactionHistory: [],
  currentTransaction: null,
  transactionStatus: 'idle',
  
  addTransaction: (transaction) =>
    set((state) => ({
      pendingTransactions: [...state.pendingTransactions, transaction],
      transactionHistory: [transaction, ...state.transactionHistory],
    })),
  
  updateTransaction: (hash, updates) =>
    set((state) => {
      const updatedPending = state.pendingTransactions.map((tx) =>
        tx.hash === hash ? { ...tx, ...updates, updatedAt: Date.now() } : tx
      );
      const updatedHistory = state.transactionHistory.map((tx) =>
        tx.hash === hash ? { ...tx, ...updates, updatedAt: Date.now() } : tx
      );
      
      return {
        pendingTransactions: updatedPending.filter((tx) => tx.status === 'pending'),
        transactionHistory: updatedHistory,
        currentTransaction:
          state.currentTransaction?.hash === hash
            ? { ...state.currentTransaction, ...updates }
            : state.currentTransaction,
      };
    }),
  
  setCurrentTransaction: (transaction) =>
    set({ currentTransaction: transaction }),
  
  setTransactionStatus: (status) =>
    set({ transactionStatus: status }),
  
  clearPendingTransactions: () =>
    set((state) => ({
      pendingTransactions: [],
      transactionHistory: state.transactionHistory.filter((tx) => tx.status !== 'pending'),
    })),
}));

