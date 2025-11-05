// Merchant Types

export interface MerchantLocation {
  street: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  lat: number;
  lng: number;
}

export interface Merchant {
  id: string;
  name: string;
  logo: string; // URL or emoji
  banner: string; // URL
  photo: string; // Main listing photo URL
  address: MerchantLocation;
  bnbRebate: number; // Percentage (e.g., 20 for 20%)
  tokenRebate: number; // Percentage (e.g., 10 for 10%)
  tokenSymbol: string; // e.g., "TRBCC"
  tokenName: string; // e.g., "The Roasted Bean Coffee Token"
  tokenPurchasePlans: TokenPurchasePlan[];
  supportedCurrencies: string[]; // e.g., ["BNB", "USDT", "USD1"]
  distance?: number; // Calculated distance from user (km)
  about: string;
  category: string;
}

export interface TokenPurchasePlan {
  buy: number; // Amount to buy
  free: number; // Bonus amount
}

export interface MerchantToken {
  merchantId: string;
  merchantName: string;
  merchantLogo: string;
  tokenSymbol: string;
  balance: number; // User's balance of this merchant's tokens
  lastUpdated: number; // Timestamp
  estimatedValueRM: number; // Estimated value in Malaysian Ringgit
}

export interface MerchantSearchFilters {
  query: string;
  location?: {
    lat: number;
    lng: number;
  };
  maxDistance?: number; // km
  minBNBRebate?: number;
  minTokenRebate?: number;
  category?: string;
}

