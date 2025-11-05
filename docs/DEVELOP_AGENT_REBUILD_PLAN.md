# Develop Agent - Complete Rebuild Plan

**Date**: 2025-11-05 14:00:00  
**Agent**: Develop Agent  
**Status**: 🚨 **REBUILD IN PROGRESS**  
**Reason**: Product mismatch - Built generic Web3 PWA instead of RVMplus Dapps loyalty ecosystem

---

## 🎯 Rebuild Objective

Transform the current generic Web3 payment PWA into the **RVMplus Dapps** loyalty and rewards ecosystem as specified in the Figma mockups.

---

## 📋 Rebuild Checklist

### Phase 1: Data Models & State Management (Priority: CRITICAL)

#### RVM Token System
- [ ] Create `types/rvm.ts` - RVM token types
- [ ] Create `store/rvmStore.ts` - RVM token state management
- [ ] Implement RVM balance tracking
- [ ] Implement RVM rewards system
- [ ] Implement token purchase packages

#### Merchant Token System
- [ ] Create `types/merchant-token.ts` - Merchant token types
- [ ] Create `store/merchantTokenStore.ts` - Merchant token state
- [ ] Implement per-merchant token balances
- [ ] Implement total token value calculation (RM)

#### Merchant System
- [ ] Create `types/merchant.ts` - Merchant data types
- [ ] Create `store/merchantStore.ts` - Merchant state
- [ ] Implement merchant data with physical locations
- [ ] Implement rebate calculations (BNB % + Token %)
- [ ] Implement distance calculation

#### Currency System
- [ ] Create `lib/utils/currency.ts` - Currency conversion utilities
- [ ] Implement crypto to RM conversion
- [ ] Support BNB, USDT, USD1, Cake, RVM

#### Location System
- [ ] Create `lib/utils/location.ts` - Geolocation utilities
- [ ] Implement distance calculation
- [ ] Implement location-based search

---

### Phase 2: Core Pages Rebuild (Priority: CRITICAL)

#### 1. Home Page → RVMplus Dashboard
**File**: `app/page.tsx`

- [ ] Remove generic hero section
- [ ] Add RVM balance display (large, with change %)
- [ ] Add 4 navigation cards:
  - Buy RVM
  - Transaction
  - Navigation
  - Link RVM Apps
- [ ] Add BNB Reward Summary card
- [ ] Add promotional banners
- [ ] Add About section
- [ ] Add "My account" button (top left)
- [ ] Add "BNB Chain" network selector (top right)

#### 2. Marketplace Page → Physical Merchant Marketplace
**File**: `app/marketplace/page.tsx`

- [ ] Add location display (city, state)
- [ ] Update search to location/merchant search
- [ ] Replace product cards with merchant cards:
  - Merchant photo
  - Full physical address
  - BNB rebate badge
  - Token rebate badge
  - Distance display
  - Navigate button (maps integration)
- [ ] Remove generic product catalog
- [ ] Add location-based filtering

#### 3. Tokens Page → Merchant Token Portfolio
**File**: `app/tokens/page.tsx`

- [ ] Update to show merchant-specific tokens
- [ ] Add search merchant/token functionality
- [ ] Display merchant logo, name, token amount
- [ ] Add "Last updated" timestamps
- [ ] Add summary bar:
  - Total Tokens count
  - Total Estimated Value (RM)
- [ ] Remove generic token list

#### 4. Swap Page → RVM Token Purchase System
**File**: `app/swap/page.tsx`

- [ ] Add promotional banner ("Buy More Free More")
- [ ] Replace swap interface with package selection:
  - Radio buttons for packages
  - 10000+1000, 20000+2200, 50000+6000
  - Total display
- [ ] Add "Swap Now" button
- [ ] Add "Swap with" options: BNB, USDT, Cake (with icons)
- [ ] Add FAQ section (expandable)
- [ ] Add "Link Your Apps" button
- [ ] Remove generic token swap interface

#### 5. Payment Confirmation → Merchant Payment with Token Discount
**File**: `app/payment/confirm-merchant/page.tsx` (already created)

- [x] Merchant logo and name display
- [x] Token balance display (TRBCC Token: 150)
- [x] Pay With selector (BNB, USDT, USD1)
- [x] Summary section (Total, Local Currency, Token Deduct)
- [x] Actual Payment (highlighted)
- [x] Supported Network (BNB Chain)
- [x] Confirmation message
- [x] Cancel + OK buttons
- [ ] Connect to actual merchant data
- [ ] Implement real token discount calculation
- [ ] Add RM conversion

#### 6. Link Apps Page (NEW)
**File**: `app/link-apps/page.tsx`

- [ ] Create page layout
- [ ] Add download app buttons (App Store, Google Play)
- [ ] Add phone number input
- [ ] Add name input
- [ ] Add account selection (New vs Link)
- [ ] Add "Verify Now" button
- [ ] Add confirmation message
- [ ] Implement verification flow

#### 7. Merchant Settings Page (NEW)
**File**: `app/merchant/settings/page.tsx`

- [ ] Create page layout
- [ ] Add branding section (logo/banner upload)
- [ ] Add live preview
- [ ] Add business details form
- [ ] Add currency settings
- [ ] Add token purchase plan builder
- [ ] Add Save Changes button
- [ ] Implement file upload
- [ ] Implement preview generation

#### 8. QR Standee Page (NEW)
**File**: `app/qr-standee/page.tsx`

- [ ] Create standee layout
- [ ] Add Dapps Payment logo
- [ ] Add welcome message
- [ ] Generate/display QR code
- [ ] Add BNB Chain support logos
- [ ] Style for display/print

---

### Phase 3: Components (Priority: HIGH)

#### New Components Needed
- [ ] `components/rvm/RVMBalance.tsx` - RVM balance display
- [ ] `components/rvm/TokenPackageCard.tsx` - Purchase package card
- [ ] `components/merchant/MerchantCard.tsx` - Merchant listing card
- [ ] `components/merchant/MerchantTokenCard.tsx` - Merchant token card
- [ ] `components/merchant/RebateBadge.tsx` - Rebate display badge
- [ ] `components/payment/TokenDiscountCalculator.tsx` - Discount calculator
- [ ] `components/currency/RMConverter.tsx` - RM currency display
- [ ] `components/location/DistanceDisplay.tsx` - Distance from user
- [ ] `components/navigation/NavigateButton.tsx` - Maps navigation
- [ ] `components/qr/QRCodeDisplay.tsx` - QR code generator
- [ ] `components/account/AccountLinkingForm.tsx` - Link account form
- [ ] `components/merchant/SettingsForm.tsx` - Merchant settings

#### Updated Components
- [ ] Update `components/ui/Button.tsx` - Add navigation variant
- [ ] Update `components/layout/Header.tsx` - Add account + network selector

---

### Phase 4: Utilities & Helpers (Priority: MEDIUM)

- [ ] `lib/utils/rm-currency.ts` - RM conversion functions
- [ ] `lib/utils/distance.ts` - Distance calculation (haversine formula)
- [ ] `lib/utils/rebate.ts` - Rebate calculations
- [ ] `lib/utils/token-discount.ts` - Token discount calculations
- [ ] `lib/utils/qr-generator.ts` - QR code generation
- [ ] `lib/data/mock-merchants.ts` - Mock merchant data
- [ ] `lib/data/mock-packages.ts` - Mock RVM packages
- [ ] `lib/data/faqs.ts` - FAQ content

---

### Phase 5: Integration & API (Priority: MEDIUM)

- [ ] Implement geolocation API for user position
- [ ] Implement distance calculation for merchants
- [ ] Implement RM exchange rate API
- [ ] Mock merchant token balance API
- [ ] Mock RVM purchase API
- [ ] Mock verification SMS API

---

## 🎨 Updated Design System

All colors already extracted and applied:
- ✅ Primary: #00a19c (Teal)
- ✅ Accent: #f3ba2f (Gold/Yellow)
- ✅ Dark: #1e293c
- ✅ Light: #f1f5f9
- ✅ Font: Inter

---

## 📊 Estimated Rebuild Timeline

- **Phase 1**: Data models - 2 hours
- **Phase 2**: Core pages - 4 hours
- **Phase 3**: Components - 3 hours
- **Phase 4**: Utilities - 1 hour
- **Phase 5**: Integration - 2 hours

**Total**: ~12 hours of development work

---

## ✅ What Can Be Reused

From current implementation:
- ✅ Color scheme and design tokens
- ✅ Tailwind configuration
- ✅ Basic UI components (Button, Card, Input, Modal)
- ✅ Web3 configuration (wagmi, viem)
- ✅ BNB Chain setup
- ✅ PWA configuration
- ✅ Project structure
- ✅ Testing setup
- ✅ CI/CD workflows
- ✅ Compliance documentation

---

**Status**: 🚀 **STARTING REBUILD NOW**

---

## 🎯 Immediate Next Steps

1. Create data models for RVM, merchant tokens, merchants
2. Create state stores for new data
3. Rebuild Home page as RVMplus Dashboard
4. Rebuild Marketplace as physical merchant listings
5. Rebuild Tokens page as merchant token portfolio
6. Rebuild Swap as RVM purchase system
7. Create Link Apps page
8. Create Merchant Settings page
9. Create QR Standee page
10. Update all navigation and routing

**Develop Agent**: ACTIVATED ✅  
**Progress Agent**: MONITORING ✅  
**Project Manager Agent**: OVERSEEING ✅

