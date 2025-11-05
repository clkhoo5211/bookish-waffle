export type TransactionStatus = 'pending' | 'confirmed' | 'failed';
export type TransactionType = 'payment' | 'swap' | 'approval' | 'other';

export interface Transaction {
  hash: string;
  chainId: number;
  type: TransactionType;
  from: string;
  to: string;
  value: string; // Amount in wei (as string)
  tokenAddress?: string; // ERC-20 token address (optional)
  status: TransactionStatus;
  timestamp: number;
  blockNumber?: number;
  confirmations?: number;
  gasUsed?: string;
  gasPrice?: string;
  label?: string;
  notes?: string;
  synced: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface TransactionRequest {
  to: string;
  value: bigint;
  chainId: number;
  tokenAddress?: string;
  gasLimit?: bigint;
  gasPrice?: bigint;
}

export interface TransactionResponse {
  hash: string;
  chainId: number;
  status: TransactionStatus;
  blockNumber?: number;
  confirmations?: number;
}

