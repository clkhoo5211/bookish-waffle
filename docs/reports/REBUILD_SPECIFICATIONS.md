# RVMplus Dapps - Complete Rebuild Specifications

**Date**: 2025-11-05  
**Status**: 🚨 **REBUILD IN PROGRESS**

---

## 🎯 Product Overview

**RVMplus Dapps** is a loyalty and rewards ecosystem that combines:
- RVM token purchases and rewards
- Merchant-specific loyalty tokens
- Location-based merchant marketplace
- Token-based payment discounts
- BNB Chain rewards program
- Mobile app integration

**Primary Market**: Malaysia  
**Primary Currency Display**: Malaysian Ringgit (RM)  
**Primary Network**: BNB Chain (Binance Smart Chain)

---

## 📱 Complete Page Specifications

### 1. Home Page (RVMplus Dashboard)
**Figma**: `Home.png`

**Components**:
- **Account Button**: "My account" (top left)
- **Network Selector**: "BNB Chain" (top right, yellow button)
- **Welcome Header**: "Welcome to RVMplus Dapps!"
- **RVM Balance Display**: 
  - Large display: "RVM 57,789.00"
  - Change indicator: "+12.3%(RVM400.68)" in green
- **Navigation Cards** (4 cards in 2x2 grid):
  - Buy RVM (double arrow icon)
  - Transaction (document icon)
  - Navigation (paper plane icon)
  - Link RVM Apps (chain link icon)
- **BNB Reward Summary Card**:
  - BNB logo
  - "TOTAL BNB REWARDED"
  - Amount: "0.00010 BNB"
  - Last Update timestamp
- **Promotional Banners**:
  - Yellow banner with person: "Redeem RVMPlus Now!"
  - "EARN 5% BNB PLUS 5% RVM"
  - Image banner: "EARN BNB REWARD" with people/recycling sphere
- **About Section**:
  - Description of RVM Web 3.0 business reward model

**Colors**:
- Primary background: Teal (#00a19c)
- Card background: White
- Accent: Yellow/Gold (#f3ba2f)
- Text: Dark (#1e293c)

---

### 2. Marketplace (Physical Merchant Listings)
**Figma**: `Market Place.png`

**Components**:
- **Search Bar**: "Search location or merchant's name"
- **Location Display**: "Puchong, Selangor" (current location)
- **Merchant Cards** (scrollable list):
  - **Merchant Photo**: Full-width image of business
  - **Merchant Name**: Bold text
  - **Location Icon + Full Address**: "28-G, Jalan Puteri 1/4, Bandar Puteri, 47100 Puchong, Selangor"
  - **Rebate Badges**:
    - BNB Diamond icon + "20% BNB Rebates"
    - Token icon + "10% Token Rebates"
  - **Distance**: "0.5 km aways"
  - **Navigate Button**: Teal button with paper plane icon

**Features**:
- Location-based search
- Distance calculation
- Maps integration
- Filter by rebates

---

### 3. My Tokens (Merchant Token Portfolio)
**Figma**: `My Token Available.png`

**Components**:
- **Header**: "My Tokens" with refresh icon
- **Search Bar**: "Search Merchant or token"
- **Token List Cards** (scrollable):
  - Merchant logo (circular)
  - Merchant name
  - Token amount: "150.75 tokens"
  - Last updated: "5m ago"
- **Summary Bar** (bottom):
  - Left: "Total Tokens" + count (5)
  - Right: "Total Estimated Value" + RM amount (RM120.00)

**Features**:
- Search functionality
- Token balance per merchant
- Total value in RM
- Auto-refresh

---

### 4. Swap RVM Token (Token Purchase System)
**Figma**: `Swap.png`

**Components**:
- **Promotional Banner**: "Buy More Free More" with shopping person
- **Token Package Selection** (radio buttons):
  - Package 1: "10000 + 1000 RVM" = TOTAL 11000
  - Package 2: "20000 + 2200 RVM" = TOTAL 22200
  - Package 3: "50000 + 6000 RVM" = TOTAL 56000
- **Swap Now Button**: Teal with swap icon
- **Swap With Options**:
  - BNB (diamond icon)
  - USDT (teal icon)
  - Cake (rabbit icon)
- **FAQ Section** (expandable):
  - "How to use RVM Token"
  - "Where does RVM Token Use"
- **Link Your Apps Button**: Dark button with chain icon

**Features**:
- Package selection
- Bonus calculation
- Multiple payment methods
- FAQ integration

---

### 5. Payment Confirmation (Merchant Payment with Token Discount)
**Figma**: `Dapp Confirmation （Payment) Details.png`

**Components**:
- **Title**: "DApp Confirmation (Payment) Details"
- **Merchant Branding**:
  - Circular merchant logo
  - Merchant name: "The Roasted Bean Coffee Co."
- **Token Available Card**:
  - Token icon + "TRBCC Token"
  - Balance: "150"
- **Pay With Selector** (3 buttons):
  - BNB (gray)
  - USDT (teal - selected)
  - USD1 (gray)
- **Summary Section**:
  - Total Spending: "50.00 USDT"
  - Local Currency: "~ RM235.00"
  - Token Avail. Deduct: "100"
- **Actual Payment Box** (highlighted):
  - "40.00 USDT"
  - "~ RM165.00"
- **Supported Network**:
  - BNB Chain logo + name
- **Confirmation Message**: "Confirm to continue connecting to this merchant's DApp"
- **Action Buttons**:
  - Cancel (outline)
  - OK (teal)

**Features**:
- Token balance display
- Automatic discount calculation
- RM conversion
- Network display

---

### 6. Link with RVM Apps (Account Linking)
**Figma**: `Link with.png`, `Link with-1.png`

**Page 1: Link with RVM Apps**
- Download RVMPlus app buttons (App Store, Google Play)
- **Information Provided**:
  - Phone Number input
  - Name input
- **Account Selection** (radio buttons):
  - New Account (selected)
  - Link Account
- **Verify Now Button** (teal)
- **Confirmation Message**: "Upon completing the verification process, we will assist you in linking Dapps to your current accounts."

**Page 2: Merchant Settings**
- **Branding**:
  - Upload Logo (500x500px)
  - Upload Banner (1500x500px)
- **Live Preview**: Shows how merchant listing appears
- **Business Details**:
  - Company Name
  - Token Name
  - About Your Company (textarea)
- **Currency Settings**: Currency Accept dropdown
- **Token Purchase Plan**:
  - Buy/Free pairs (e.g., Buy 100 Free 10)
  - Add More button
- **Save Changes Button**

---

### 7. Standee (QR Code Display)
**Figma**: `Standee.png`

**Components**:
- Dapps Payment logo
- "Welcome Use Dapps Payment"
- Large QR code with logo in center
- "Support BNB Chain"
- BNB Chain logos

---

## 🛠️ Technical Architecture

### Data Models

```typescript
// RVM Token
interface RVMToken {
  balance: number;
  rewards: number;
  change24h: number;
  changePercent: number;
}

// Merchant Token
interface MerchantToken {
  merchantId: string;
  merchantName: string;
  tokenSymbol: string;
  balance: number;
  lastUpdated: number;
  estimatedValueRM: number;
}

// Merchant
interface Merchant {
  id: string;
  name: string;
  logo: string;
  banner: string;
  photo: string;
  address: {
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  bnbRebate: number; // percentage
  tokenRebate: number; // percentage
  tokenSymbol: string;
  tokenPurchasePlans: {
    buy: number;
    free: number;
  }[];
  supportedCurrencies: string[];
  distance?: number; // calculated from user location
}

// Token Purchase Package
interface TokenPackage {
  base: number;
  bonus: number;
  total: number;
  price: {
    bnb?: number;
    usdt?: number;
    cake?: number;
  };
}

// Payment Transaction
interface PaymentTransaction {
  merchantId: string;
  merchantName: string;
  merchantLogo: string;
  totalSpending: number;
  currency: string;
  localCurrency: string; // RM
  tokenAvailable: number;
  tokenDeduct: number;
  actualPayment: number;
  actualLocalCurrency: string; // RM
  network: string;
  timestamp: number;
}
```

---

## 🎨 Design Tokens (Extracted)

### Colors
- Primary Teal: `#00a19c`
- Accent Gold: `#f3ba2f`
- Dark Text: `#1e293c`
- Light Background: `#f1f5f9`
- White: `#ffffff`
- Success Green: `#10B981`
- Warning Yellow: `#F59E0B`

### Typography
- Font: Inter
- H1: 32-40px, Bold
- H2: 24-32px, Semi-Bold
- Body: 16px, Regular
- Small: 14px, Regular

---

## 📊 Rebuild Priority

### Phase 1: Core RVM System (High Priority)
1. ✅ RVM token balance tracking
2. ✅ Token purchase packages
3. ✅ RVM rewards display
4. ✅ BNB rewards tracking

### Phase 2: Merchant System (High Priority)
1. ✅ Merchant token balances
2. ✅ Physical merchant marketplace
3. ✅ Location-based search
4. ✅ Merchant payment with token discount

### Phase 3: App Linking (Medium Priority)
1. ✅ Account linking flow
2. ✅ Verification system
3. ✅ Merchant settings portal

### Phase 4: Integration (Medium Priority)
1. ✅ Maps API integration
2. ✅ RM currency conversion
3. ✅ BNB Chain integration
4. ✅ SMS verification

---

**Status**: 🚨 **REBUILD STARTING** - Develop Agent activated

