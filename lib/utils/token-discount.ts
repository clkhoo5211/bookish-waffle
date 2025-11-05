// Token discount calculation utilities

export interface TokenDiscountCalculation {
  totalSpending: number;
  currency: string;
  tokenAvailable: number;
  tokenValue: number; // Value of 1 token in the payment currency
  tokenToDeduct: number;
  discountAmount: number;
  actualPayment: number;
}

/**
 * Calculate payment with token discount
 * @param totalSpending - Original spending amount
 * @param currency - Payment currency (USDT, BNB, etc.)
 * @param tokenAvailable - Available merchant tokens
 * @param tokenValueRate - How much 1 token is worth (e.g., 1 token = 0.10 USDT)
 */
export function calculateTokenDiscount(
  totalSpending: number,
  currency: string,
  tokenAvailable: number,
  tokenValueRate: number = 0.10 // Default: 1 token = 0.10 of currency
): TokenDiscountCalculation {
  // Calculate maximum discount based on available tokens
  const maxDiscount = tokenAvailable * tokenValueRate;
  
  // Discount cannot exceed total spending
  const discountAmount = Math.min(maxDiscount, totalSpending);
  
  // Calculate tokens to deduct
  const tokenToDeduct = Math.floor(discountAmount / tokenValueRate);
  
  // Calculate actual payment
  const actualPayment = totalSpending - discountAmount;
  
  return {
    totalSpending,
    currency,
    tokenAvailable,
    tokenValue: tokenValueRate,
    tokenToDeduct,
    discountAmount,
    actualPayment,
  };
}

/**
 * Calculate token earning from a purchase
 * @param amount - Purchase amount
 * @param tokenRewardRate - Percentage of purchase that becomes tokens (e.g., 10 for 10%)
 */
export function calculateTokenEarning(
  amount: number,
  tokenRewardRate: number
): number {
  return Math.floor((amount * tokenRewardRate) / 100);
}

/**
 * Calculate BNB reward from a purchase
 * @param amount - Purchase amount
 * @param bnbRewardRate - Percentage of purchase that becomes BNB rewards (e.g., 20 for 20%)
 * @param currencyToBNBRate - Conversion rate from currency to BNB
 */
export function calculateBNBReward(
  amount: number,
  bnbRewardRate: number,
  currencyToBNBRate: number = 0.0003 // Default: 1 USDT = 0.0003 BNB
): number {
  const rewardInCurrency = (amount * bnbRewardRate) / 100;
  return rewardInCurrency * currencyToBNBRate;
}

