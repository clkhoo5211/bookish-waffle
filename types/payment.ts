// Payment Types

export interface MerchantPayment {
  merchantId: string;
  merchantName: string;
  merchantLogo: string;
  tokenSymbol: string;
  tokenBalance: number; // User's available merchant tokens
  totalSpending: number;
  currency: string; // "USDT", "BNB", "USD1"
  localCurrency: string; // RM equivalent (e.g., "~ RM235.00")
  tokenDeduct: number; // Tokens to deduct for discount
  actualPayment: number; // After token discount
  actualLocalCurrency: string; // RM equivalent after discount
  network: string; // "BNB Chain"
  selectedPaymentMethod: string;
}

export interface PaymentConfirmation {
  id: string;
  merchantId: string;
  amount: number;
  currency: string;
  tokenDiscountApplied: number;
  bnbRewardEarned: number;
  localCurrencyAmount: string; // RM
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  txHash?: string;
}

