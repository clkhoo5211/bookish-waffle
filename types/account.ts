// Account & Linking Types

export interface UserAccount {
  id: string;
  phone: string;
  name: string;
  walletAddress?: string;
  rvmBalance: number;
  bnbRewards: number;
  merchantTokens: {
    [merchantId: string]: number; // merchantId -> token balance
  };
  linkedApps: string[]; // Array of linked app IDs
  createdAt: number;
  verified: boolean;
}

export interface AccountLinkingRequest {
  phone: string;
  name: string;
  accountType: 'new' | 'link';
  verificationCode?: string;
}

export interface MerchantSettings {
  merchantId: string;
  branding: {
    logo: string; // URL or file upload
    banner: string; // URL or file upload
  };
  businessDetails: {
    companyName: string;
    tokenName: string;
    about: string;
  };
  currencySettings: {
    acceptedCurrencies: string[]; // ["BNB", "USDT", "USD1"]
  };
  tokenPurchasePlans: {
    buy: number;
    free: number;
  }[];
}

