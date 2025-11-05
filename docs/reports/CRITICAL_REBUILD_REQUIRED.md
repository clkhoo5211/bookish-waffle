# 🚨 CRITICAL REBUILD REQUIRED

**Date**: 2025-11-05  
**Status**: ⚠️ **MAJOR PRODUCT MISMATCH IDENTIFIED**  
**Severity**: CRITICAL - Wrong Product Built

---

## 🔴 Problem Summary

The Develop Agent built a **generic Web3 payment PWA** when the Figma mockups clearly show a **RVMplus Dapps loyalty/rewards ecosystem** - a completely different product.

---

## 📋 What Figma Mockups Actually Show

### **RVMplus Dapps - Loyalty & Rewards Ecosystem**

#### 1. **Home.png** - RVMplus Dashboard
- RVM token balance display (57,789 RVM)
- BNB Chain integration (network selector)
- Four core features:
  - Buy RVM tokens
  - View transactions
  - Navigate to merchants
  - Link RVM Apps
- BNB Reward summary section
- Promotional banners ("Buy More Free More")
- About section describing reward model

#### 2. **Market Place.png** - Physical Merchant Marketplace
- Location-based search (Puchong, Selangor)
- Physical merchant listings with:
  - Photos of actual businesses (Nas Fish n Chips)
  - Full physical addresses
  - Distance from user (0.5 km)
  - BNB rebates (20%)
  - Token rebates (10%)
  - Navigate button (maps integration)
- Malaysian market focus

#### 3. **My Token Available.png** - Merchant Loyalty Tokens
- Search for merchants/tokens
- List of merchant-specific tokens:
  - The Roasted Bean Coffee Co. (TRBCC)
  - Token amounts (150.75 tokens)
  - Last updated timestamps
- Summary bar:
  - Total Tokens: 5
  - Total Estimated Value: RM120.00 (Malaysian Ringgit)

#### 4. **Swap.png** - RVM Token Purchase System
- Promotional banner ("Buy More Free More")
- RVM token purchase packages:
  - 10,000 + 1,000 bonus = 11,000 RVM
  - 20,000 + 2,200 bonus = 22,200 RVM
  - 50,000 + 6,000 bonus = 56,000 RVM
- "Swap Now" button
- Swap with: BNB, USDT, Cake
- FAQ section ("How to use RVM Token", "Where does RVM Token Use")
- "Link Your Apps" button

#### 5. **Link with.png / Link with-1.png** - App Linking & Merchant Settings
- **Link with RVM Apps** screen:
  - Download RVMPlus app (App Store/Google Play)
  - Information collection (Phone Number, Name)
  - Account selection (New Account vs Link Account)
  - "Verify Now" button
  - Account linking confirmation
- **Merchant Settings** screen:
  - Branding: Upload Logo, Upload Banner
  - Live Preview of merchant listing
  - Business Details: Company Name, Token Name, About
  - Currency Settings
  - Token Purchase Plan: Buy X Free Y offers
  - Save Changes button

#### 6. **Dapp Confirmation.png** - Merchant Payment with Token Discount
- Merchant branding (logo + name)
- Token balance display (TRBCC Token: 150)
- Payment method selector (BNB, USDT, USD1)
- Summary:
  - Total Spending: 50.00 USDT
  - Local Currency: ~ RM235.00
  - Token Avail. Deduct: 100
- **Actual Payment** (after token discount): 40.00 USDT (~ RM165.00)
- Supported Network: BNB Chain
- Confirmation: "Confirm to continue connecting to this merchant's DApp"

#### 7. **Standee.png** - QR Code Promotional Display
- "Welcome Use Dapps Payment"
- Large QR code for payment
- "Support BNB Chain" with logos

---

## ❌ What Was Actually Built

### Generic Web3 Payment PWA (Wrong Product)
- Basic crypto payments (no RVM token)
- Generic marketplace (no physical locations, no addresses)
- Simple token swap (no RVM packages)
- No merchant tokens
- No app linking functionality
- No RM currency support
- No BNB rewards system
- No merchant settings/branding
- No token discount system
- No location-based features

---

## ✅ What Needs to Be Built

### **RVMplus Dapps - Complete Feature List**

#### Core Features:
1. **RVM Token System**
   - RVM token balance tracking
   - Token purchase packages with bonuses
   - RVM rewards accumulation
   - Integration with BNB Chain

2. **Merchant Loyalty Tokens**
   - Merchant-specific tokens (e.g., TRBCC for coffee shop)
   - Token balance per merchant
   - Token redemption for discounts
   - Total tokens and estimated value (in RM)

3. **Physical Merchant Marketplace**
   - Location-based search (GPS integration)
   - Physical merchant listings with:
     - Photos
     - Full addresses
     - Distance calculation
     - BNB rebate %
     - Token rebate %
     - Navigate to location (maps)

4. **Payment with Token Discounts**
   - Merchant branding display
   - Available token balance
   - Payment method selection (BNB, USDT, etc.)
   - Automatic token deduction calculation
   - Shows: Total → Token Deduct → Actual Payment
   - Local currency (RM) conversion
   - BNB Chain network support

5. **App Linking System**
   - Download RVMPlus mobile app
   - Phone/Name verification
   - New Account vs Link existing account
   - DApp account linking
   - Merchant onboarding

6. **Merchant Settings**
   - Upload logo and banner
   - Live preview of listing
   - Business details configuration
   - Token name customization
   - Token purchase plan creation (Buy X Free Y)
   - Currency acceptance settings

7. **BNB Rewards System**
   - Total BNB rewarded tracking
   - Last update timestamp
   - Integration with purchases

8. **Transaction System**
   - Transaction history
   - Payment tracking
   - Reward tracking

9. **Navigation System**
   - Integrate with maps for merchant navigation
   - Distance calculation
   - Route planning

---

## 🔧 Technical Requirements

### Currency Support
- **Primary**: RVM Token (custom token)
- **Secondary**: BNB, USDT, USD1, Cake
- **Fiat Display**: Malaysian Ringgit (RM)

### Network Focus
- **Primary**: BNB Chain (Binance Smart Chain)
- **Secondary**: Multi-chain support

### Data Models
1. **RVM Token**
   - Balance
   - Rewards
   - Purchase history

2. **Merchant Token**
   - Per-merchant token balances
   - Token metadata
   - Redemption rules

3. **Merchant**
   - Business details
   - Physical location (lat/lon)
   - Address
   - Photos (logo, banner, listing)
   - BNB rebate %
   - Token rebate %
   - Token purchase plans
   - Supported currencies

4. **Transaction**
   - Amount
   - Currency
   - Token discount applied
   - BNB rewards earned
   - Local currency (RM) equivalent

5. **User Account**
   - Phone number
   - Name
   - Wallet address
   - RVM balance
   - Merchant token balances
   - Linked apps

### Key Integrations
- BNB Chain (primary network)
- Maps API (for navigation)
- SMS/Email verification
- Mobile app linking
- Currency conversion API (crypto to RM)

---

## 📊 Rebuild Scope

### Pages to Rebuild:
1. ✅ Home → RVMplus Dashboard
2. ✅ Marketplace → Location-based Merchant Marketplace
3. ✅ Tokens → Merchant Token Portfolio
4. ✅ Swap → RVM Token Purchase System
5. ✅ Payment Confirmation → Merchant Payment with Token Discount
6. ✅ Link Apps → Account Linking & Verification
7. ✅ Merchant Settings → Merchant Configuration Portal
8. ✅ Standee/QR → Payment QR Code Display

### Components to Build:
- RVM Token display
- Merchant card (with location, rebates, navigate)
- Token discount calculator
- Token purchase package selector
- Account linking form
- Merchant settings form
- BNB rewards tracker
- RM currency converter

### State Management:
- RVM token balance
- Merchant token balances
- User location
- Merchant data
- Rewards tracking

---

## 🎯 Action Required

**IMMEDIATE**: Develop Agent needs to rebuild the entire application to match the actual RVMplus Dapps system shown in the Figma mockups.

**Priority**: CRITICAL - This is not the same product at all.

---

**Status**: ⏳ **Awaiting Develop Agent Activation for Complete Rebuild**

