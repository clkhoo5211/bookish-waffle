export interface Token {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  balance?: string;
  priceUSD?: number;
  lastPriceUpdate?: number;
}

export interface TokenBalance {
  address: string;
  chainId: number;
  tokenAddress?: string;
  balance: string;
  formatted: string;
  symbol: string;
  decimals: number;
}

export interface TokenList {
  chainId: number;
  tokens: Token[];
  lastUpdated: number;
  source: 'local' | 'api';
}

