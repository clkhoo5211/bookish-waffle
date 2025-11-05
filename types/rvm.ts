// RVM Token Types

export interface RVMBalance {
  balance: number; // Total RVM tokens
  rewards: number; // Rewards earned
  change24h: number; // Change in last 24 hours
  changePercent: number; // Percentage change
}

export interface RVMTokenPackage {
  id: string;
  base: number; // Base tokens (e.g., 10000)
  bonus: number; // Bonus tokens (e.g., 1000)
  total: number; // Total (base + bonus)
  price: {
    bnb?: number;
    usdt?: number;
    cake?: number;
  };
}

export interface BNBReward {
  total: number; // Total BNB rewarded
  lastUpdate: number; // Timestamp
}

export interface RVMTransaction {
  id: string;
  type: 'purchase' | 'reward' | 'spend';
  amount: number;
  currency: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
}

