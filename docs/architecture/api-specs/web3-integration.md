# Web3 Integration API Specifications - RVM Web3 Payment PWA

**Created**: 2025-11-05  
**Project Name**: RVM Web3 Payment PWA  
**Version**: 1.0  
**Status**: Approved  
**Design Agent**: System Architect

---

## 📋 Document Overview

This document specifies the Web3 integration patterns, APIs, and data structures for the RVM Web3 Payment PWA. Since this is a client-side PWA, there are no traditional REST APIs, but rather Web3 protocol integrations and client-side service patterns.

---

## 🔌 Web3 Integration Patterns

### Wallet Connection API

#### connectWallet(chainId: number, walletType: WalletType): Promise<WalletConnection>
**Purpose**: Connect wallet to specified blockchain network

**Parameters**:
- `chainId`: Blockchain network ID (1 = Ethereum, 137 = Polygon, etc.)
- `walletType`: 'metamask' | 'walletconnect' | 'privy' | 'coinbase'

**Returns**: `Promise<WalletConnection>`
```typescript
interface WalletConnection {
  address: string;
  chainId: number;
  isConnected: boolean;
  walletType: WalletType;
}
```

**Error Handling**:
- `WalletNotFoundError`: Wallet not installed
- `ConnectionRejectedError`: User rejected connection
- `NetworkError`: Network connection failed

---

### Transaction API

#### sendTransaction(transaction: TransactionRequest): Promise<TransactionResponse>
**Purpose**: Send cryptocurrency transaction

**Parameters**:
```typescript
interface TransactionRequest {
  to: string;                    // Recipient address
  value: bigint;                 // Amount in wei
  chainId: number;               // Blockchain network
  tokenAddress?: string;         // ERC-20 token address (optional)
  gasLimit?: bigint;             // Gas limit (optional)
  gasPrice?: bigint;             // Gas price (optional)
}
```

**Returns**: `Promise<TransactionResponse>`
```typescript
interface TransactionResponse {
  hash: string;                  // Transaction hash
  chainId: number;               // Blockchain network
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;          // Block number when confirmed
  confirmations?: number;        // Number of confirmations
}
```

**Error Handling**:
- `InsufficientBalanceError`: Insufficient balance
- `TransactionRejectedError`: User rejected transaction
- `TransactionFailedError`: Transaction failed on blockchain
- `GasEstimationError`: Gas estimation failed

---

### Token Balance API

#### getTokenBalance(address: string, chainId: number, tokenAddress?: string): Promise<TokenBalance>
**Purpose**: Get token balance for address

**Parameters**:
- `address`: Wallet address
- `chainId`: Blockchain network ID
- `tokenAddress`: ERC-20 token address (optional, native token if omitted)

**Returns**: `Promise<TokenBalance>`
```typescript
interface TokenBalance {
  address: string;               // Wallet address
  chainId: number;               // Blockchain network
  tokenAddress?: string;         // Token address (native if undefined)
  balance: string;               // Balance in wei (as string)
  formatted: string;             // Formatted balance (e.g., "1.5 ETH")
  symbol: string;                // Token symbol (ETH, USDT, etc.)
  decimals: number;              // Token decimals
  usdValue?: number;             // USD value (if available)
}
```

---

### Gas Estimation API

#### estimateGas(transaction: TransactionRequest): Promise<GasEstimate>
**Purpose**: Estimate gas fees for transaction

**Parameters**: `TransactionRequest` (same as sendTransaction)

**Returns**: `Promise<GasEstimate>`
```typescript
interface GasEstimate {
  gasLimit: bigint;              // Estimated gas limit
  gasPrice: bigint;              // Current gas price
  maxFeePerGas?: bigint;         // Max fee per gas (EIP-1559)
  maxPriorityFeePerGas?: bigint; // Max priority fee (EIP-1559)
  totalCost: bigint;             // Total cost in wei
  totalCostFormatted: string;    // Formatted cost (e.g., "0.002 ETH")
  usdCost?: number;              // USD cost (if available)
}
```

---

### Multi-Chain Support API

#### getSupportedChains(): Chain[]
**Purpose**: Get list of supported blockchain networks

**Returns**: `Chain[]`
```typescript
interface Chain {
  id: number;                    // Chain ID
  name: string;                  // Chain name
  nativeCurrency: {
    name: string;                // Currency name
    symbol: string;              // Currency symbol
    decimals: number;            // Decimals
  };
  rpcUrls: string[];             // RPC URLs
  blockExplorers?: {
    name: string;
    url: string;
  }[];
  isTestnet: boolean;            // Testnet flag
}
```

#### switchChain(chainId: number): Promise<void>
**Purpose**: Switch active blockchain network

**Parameters**:
- `chainId`: Target blockchain network ID

**Returns**: `Promise<void>`

**Error Handling**:
- `ChainNotSupportedError`: Chain not supported
- `SwitchRejectedError`: User rejected chain switch

---

## 🔄 Custom React Hooks

### useWallet()
**Purpose**: Wallet connection and management hook

**Returns**:
```typescript
{
  address: string | undefined;
  isConnected: boolean;
  chainId: number | undefined;
  connect: (walletType: WalletType) => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: number) => Promise<void>;
  error: Error | null;
}
```

### useTokenBalance(address: string, chainId: number, tokenAddress?: string)
**Purpose**: Get and monitor token balance

**Returns**:
```typescript
{
  balance: TokenBalance | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

### useTransaction()
**Purpose**: Transaction management hook

**Returns**:
```typescript
{
  sendTransaction: (request: TransactionRequest) => Promise<TransactionResponse>;
  estimateGas: (request: TransactionRequest) => Promise<GasEstimate>;
  transactionStatus: TransactionStatus;
  isLoading: boolean;
  error: Error | null;
}
```

---

## 📊 Data Structures

### Transaction Types

```typescript
// Transaction status
type TransactionStatus = 
  | 'idle'
  | 'preparing'
  | 'signing'
  | 'pending'
  | 'confirmed'
  | 'failed';

// Transaction type
type TransactionType = 
  | 'payment'
  | 'swap'
  | 'approval'
  | 'other';

// Complete transaction interface
interface Transaction {
  hash: string;
  type: TransactionType;
  from: string;
  to: string;
  value: string;
  chainId: number;
  tokenAddress?: string;
  status: TransactionStatus;
  timestamp: number;
  blockNumber?: number;
  confirmations?: number;
  gasUsed?: bigint;
  gasPrice?: bigint;
  error?: string;
}
```

### Token Types

```typescript
// Token interface
interface Token {
  address: string;               // Token contract address (native if "native")
  chainId: number;               // Blockchain network
  symbol: string;                // Token symbol
  name: string;                  // Token name
  decimals: number;              // Token decimals
  logoURI?: string;              // Token logo URL
  priceUSD?: number;             // USD price (if available)
}

// Token list (for management)
interface TokenList {
  chainId: number;
  tokens: Token[];
}
```

---

## 🔐 Authentication & Authorization

### Wallet-Based Authentication

This PWA uses wallet-based authentication (no traditional username/password):
- **Wallet Signature**: Users sign messages to authenticate
- **Session Management**: Wallet connection = authenticated session
- **Multi-Wallet Support**: Multiple wallets can be connected simultaneously

### Authorization Model

- **Read Access**: Anyone can view public data
- **Write Access**: Requires connected wallet
- **Transaction Signing**: Requires wallet approval

---

## 🔄 Real-Time Updates

### Transaction Status Polling

```typescript
// Poll transaction status until confirmed
const pollTransactionStatus = async (
  hash: string,
  chainId: number
): Promise<TransactionStatus> => {
  // Poll every 2 seconds
  // Timeout after 5 minutes
  // Return final status
};
```

### Balance Updates

```typescript
// Subscribe to balance updates
const subscribeToBalance = (
  address: string,
  chainId: number,
  callback: (balance: TokenBalance) => void
): () => void => {
  // Poll balance every 10 seconds
  // Call callback on changes
  // Return unsubscribe function
};
```

---

## 🌐 External Service Integration

### Price API Integration

#### getTokenPrice(tokenAddress: string, chainId: number): Promise<number>
**Purpose**: Get USD price for token

**Service**: CoinGecko API (or alternative)
**Caching**: 60 seconds cache

### DEX Integration (Phase 2)

#### getSwapQuote(fromToken: string, toToken: string, amount: string): Promise<SwapQuote>
**Purpose**: Get swap quote from DEX aggregator

**Service**: 1inch API or Uniswap
**Returns**:
```typescript
interface SwapQuote {
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  rate: string;
  slippage: number;
  gasEstimate: bigint;
}
```

---

## 📝 Error Handling

### Error Types

```typescript
// Base error class
class Web3Error extends Error {
  code: string;
  chainId?: number;
}

// Specific error types
class WalletNotFoundError extends Web3Error {}
class ConnectionRejectedError extends Web3Error {}
class TransactionRejectedError extends Web3Error {}
class InsufficientBalanceError extends Web3Error {}
class TransactionFailedError extends Web3Error {}
class GasEstimationError extends Web3Error {}
class NetworkError extends Web3Error {}
```

### Error Handling Pattern

```typescript
try {
  const result = await sendTransaction(request);
  // Handle success
} catch (error) {
  if (error instanceof InsufficientBalanceError) {
    // Show insufficient balance message
  } else if (error instanceof TransactionRejectedError) {
    // User rejected, no action needed
  } else {
    // Generic error handling
  }
}
```

---

## 🔒 Security Considerations

### Transaction Security
- **Validation**: All transactions validated before sending
- **Gas Limits**: Maximum gas limits to prevent excessive fees
- **Address Validation**: Recipient addresses validated (checksum)
- **Amount Validation**: Amounts validated (not negative, within balance)

### Wallet Security
- **Private Keys**: Never accessed or stored
- **Signing**: All signing in user's wallet
- **Connection Security**: Secure wallet connection protocols
- **Phishing Protection**: Clear UI indicators, transaction verification

---

## 📊 Performance Optimization

### Caching Strategy
- **Token Prices**: Cache for 60 seconds
- **Token Lists**: Cache for 5 minutes
- **Balance Data**: Cache for 10 seconds
- **Chain Data**: Cache indefinitely (static)

### Request Optimization
- **Batch Requests**: Batch multiple RPC calls
- **Debouncing**: Debounce balance updates
- **Request Deduplication**: Deduplicate identical requests

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-05  
**Next Review**: After implementation begins

