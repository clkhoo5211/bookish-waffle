// Malaysian Ringgit (RM) currency utilities

// Mock exchange rates (in production, fetch from API)
const EXCHANGE_RATES = {
  USDT: 4.70, // 1 USDT = 4.70 RM
  BNB: 1410.00, // 1 BNB = 1410 RM
  ETH: 7050.00, // 1 ETH = 7050 RM
  USD1: 4.70, // 1 USD1 = 4.70 RM
  Cake: 1.40, // 1 Cake = 1.40 RM
  RVM: 0.30, // 1 RVM = 0.30 RM
};

/**
 * Convert crypto amount to Malaysian Ringgit (RM)
 */
export function convertToRM(amount: number, currency: string): number {
  const rate = EXCHANGE_RATES[currency as keyof typeof EXCHANGE_RATES] || 1;
  return amount * rate;
}

/**
 * Format RM amount for display
 */
export function formatRM(amount: number): string {
  return `~ RM${amount.toFixed(2)}`;
}

/**
 * Convert RM to crypto amount
 */
export function convertFromRM(amountRM: number, currency: string): number {
  const rate = EXCHANGE_RATES[currency as keyof typeof EXCHANGE_RATES] || 1;
  return amountRM / rate;
}

/**
 * Get exchange rate for a currency pair
 */
export function getExchangeRate(fromCurrency: string, toCurrency: string = 'RM'): number {
  if (toCurrency === 'RM') {
    return EXCHANGE_RATES[fromCurrency as keyof typeof EXCHANGE_RATES] || 1;
  }
  return 1;
}

