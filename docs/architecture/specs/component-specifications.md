# Component Specifications - RVM Web3 Payment PWA

**Created**: 2025-11-05  
**Project Name**: RVM Web3 Payment PWA  
**Version**: 1.0  
**Status**: Approved  
**Design Agent**: System Architect

---

## 📋 Document Overview

This document specifies the component structure, props, and implementation details for the RVM Web3 Payment PWA. Components are organized by feature area and follow atomic design principles.

---

## 🧩 Component Structure

### Atomic Design Hierarchy

```
Atoms (Basic UI Elements)
  ↓
Molecules (Simple Component Combinations)
  ↓
Organisms (Complex Components)
  ↓
Templates (Page Layouts)
  ↓
Pages (Full Pages)
```

---

## 🎨 Base UI Components (Atoms)

### Button Component

```typescript
// components/ui/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}
```

**Usage**:
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Connect Wallet
</Button>
```

### Input Component

```typescript
// components/ui/Input.tsx
interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'email' | 'password';
  error?: string;
  disabled?: boolean;
  required?: boolean;
  helperText?: string;
  className?: string;
}
```

### Modal Component

```typescript
// components/ui/Modal.tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  className?: string;
}
```

---

## 🔐 Wallet Components

### ConnectWallet Component

```typescript
// components/wallet/ConnectWallet.tsx
interface ConnectWalletProps {
  onConnect?: (address: string, chainId: number) => void;
  onDisconnect?: () => void;
  className?: string;
}
```

**Features**:
- Wallet connection modal
- Support for multiple wallet types
- Chain selection
- Connection status display

### WalletButton Component

```typescript
// components/wallet/WalletButton.tsx
interface WalletButtonProps {
  variant?: 'primary' | 'secondary';
  showAddress?: boolean;
  className?: string;
}
```

**Features**:
- Displays connection status
- Shows wallet address (truncated)
- Opens wallet modal on click

---

## 💰 Payment Components

### PaymentForm Component

```typescript
// components/payment/PaymentForm.tsx
interface PaymentFormProps {
  onSubmit: (payment: PaymentRequest) => void;
  defaultChainId?: number;
  defaultToken?: string;
  className?: string;
}
```

**Features**:
- Payment amount input
- Recipient address input
- Token/chain selection
- Gas estimation display
- Form validation

### PaymentConfirmation Component

```typescript
// components/payment/PaymentConfirmation.tsx
interface PaymentConfirmationProps {
  payment: PaymentRequest;
  gasEstimate: GasEstimate;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
}
```

**Features**:
- Transaction details display
- Gas fee breakdown
- Confirm/cancel buttons
- Security warnings

### TransactionStatus Component

```typescript
// components/payment/TransactionStatus.tsx
interface TransactionStatusProps {
  transaction: Transaction;
  onClose?: () => void;
  className?: string;
}
```

**Features**:
- Transaction status indicator
- Transaction hash display
- Block explorer link
- Confirmation count

---

## 🪙 Token Components

### TokenBalance Component

```typescript
// components/tokens/TokenBalance.tsx
interface TokenBalanceProps {
  address: string;
  chainId: number;
  tokenAddress?: string;
  showUSD?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

**Features**:
- Token balance display
- USD value display
- Loading state
- Error handling

### TokenList Component

```typescript
// components/tokens/TokenList.tsx
interface TokenListProps {
  chainId: number;
  address: string;
  onTokenSelect?: (token: Token) => void;
  showBalance?: boolean;
  className?: string;
}
```

**Features**:
- List of tokens
- Token balance display
- Token selection
- Search/filter functionality

### TokenSelector Component

```typescript
// components/tokens/TokenSelector.tsx
interface TokenSelectorProps {
  chainId: number;
  selectedToken?: Token;
  onSelect: (token: Token) => void;
  excludeTokens?: string[];
  className?: string;
}
```

**Features**:
- Token dropdown
- Token search
- Popular tokens list
- Custom token input

---

## 🔄 Swap Components

### SwapInterface Component

```typescript
// components/swap/SwapInterface.tsx
interface SwapInterfaceProps {
  defaultFromChain?: number;
  defaultToChain?: number;
  onSwap: (swap: SwapRequest) => void;
  className?: string;
}
```

**Features**:
- From/To token selection
- Amount input
- Exchange rate display
- Slippage configuration
- Swap execution

---

## 🛒 Marketplace Components

### ProductCard Component

```typescript
// components/marketplace/ProductCard.tsx
interface ProductCardProps {
  product: Product;
  onPurchase?: (product: Product) => void;
  className?: string;
}
```

**Features**:
- Product image
- Product name and description
- Price display (multiple tokens)
- Purchase button

### ProductList Component

```typescript
// components/marketplace/ProductList.tsx
interface ProductListProps {
  products: Product[];
  onProductSelect?: (product: Product) => void;
  filters?: ProductFilters;
  className?: string;
}
```

**Features**:
- Product grid/list view
- Search and filter
- Pagination
- Loading states

---

## 📱 Layout Components

### Header Component

```typescript
// components/layout/Header.tsx
interface HeaderProps {
  className?: string;
}
```

**Features**:
- Logo
- Navigation menu
- Wallet button
- Responsive mobile menu

### Footer Component

```typescript
// components/layout/Footer.tsx
interface FooterProps {
  className?: string;
}
```

**Features**:
- Links
- Social media
- Copyright
- Contact information

---

## 🎨 Component Implementation Guidelines

### TypeScript
- All components fully typed
- Props interfaces exported
- Generic types where applicable

### Accessibility
- WCAG 2.1 AA compliant
- ARIA labels and roles
- Keyboard navigation
- Screen reader support

### Responsive Design
- Mobile-first approach
- Breakpoint utilities
- Touch-friendly targets
- Responsive layouts

### Performance
- Memoization where needed
- Lazy loading for large components
- Code splitting
- Optimized re-renders

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-05  
**Next Review**: During implementation

