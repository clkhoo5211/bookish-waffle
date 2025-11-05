# Wireframes & Interface Specifications - RVM Web3 Payment PWA

**Created**: 2025-11-05  
**Project Name**: RVM Web3 Payment PWA  
**Version**: 1.0  
**Status**: Complete  
**UX Agent**: UX Design Specialist

---

## 📋 Document Overview

This document provides wireframe specifications and interface designs based on the Figma mockups provided. Each screen is documented with components, layout, and interaction specifications.

---

## 🎨 Design Mockup References

All wireframes are based on design mockups located in `design-assets/figma-mockups/`:
- `Home.png` - Main landing page
- `Market Place.png` - Marketplace interface
- `Swap.png` - Token swap interface
- `Link with.png` / `Link with-1.png` - Wallet connection modal
- `Dapp Confirmation (Payment) Details.png` / `Dapp Confirmation (Payment) Details-1.png` - Payment confirmation
- `My Token Available.png` - Token management interface
- `Standee.png` - Additional UI component

---

## 📱 Screen Wireframes

### Screen 1: Home Page
**Design Reference**: `Home.png`  
**Priority**: Must-Have (MVP)  
**User Flow**: Flow D

#### Layout Structure
```
┌─────────────────────────────────────────┐
│  Header                                  │
│  ├─ Logo                                 │
│  ├─ Navigation Menu                      │
│  │   ├─ Home                             │
│  │   ├─ Marketplace                      │
│  │   ├─ Swap                             │
│  │   ├─ My Tokens                        │
│  │   └─ Settings                         │
│  └─ Connect Wallet Button                │
├─────────────────────────────────────────┤
│  Main Content                            │
│  ├─ Hero Section                         │
│  │   ├─ Welcome Message                  │
│  │   ├─ Quick Stats                      │
│  │   └─ CTA Buttons                      │
│  ├─ Token Balance Overview               │
│  │   ├─ Total Balance (USD)              │
│  │   ├─ Token List (by chain)            │
│  │   └─ Refresh Button                   │
│  ├─ Quick Actions                        │
│  │   ├─ Make Payment                     │
│  │   ├─ Swap Tokens                      │
│  │   └─ View Marketplace                 │
│  └─ Recent Transactions                  │
│      ├─ Transaction List                 │
│      └─ View All Link                    │
├─────────────────────────────────────────┤
│  Footer                                  │
│  ├─ Links                                │
│  ├─ Social Media                         │
│  └─ Copyright                            │
└─────────────────────────────────────────┘
```

#### Key Components
- **Header**: Fixed/sticky navigation with wallet connection status
- **Token Balance Card**: Displays total balance and top tokens
- **Quick Actions**: Large, touch-friendly action buttons
- **Transaction List**: Recent transactions with status indicators

#### Interaction Specifications
- **Wallet Connection**: Click button → Modal opens
- **Token Balance**: Click token → View details
- **Quick Actions**: Click button → Navigate to feature
- **Transaction**: Click transaction → View details

#### Responsive Breakpoints
- **Mobile** (<768px): Single column, stacked layout
- **Tablet** (768px-1024px): Two columns, adjusted spacing
- **Desktop** (>1024px): Full layout with sidebar optional

---

### Screen 2: Wallet Connection Modal
**Design Reference**: `Link with.png`, `Link with-1.png`  
**Priority**: Must-Have (MVP)  
**User Flow**: Flow A

#### Layout Structure
```
┌─────────────────────────────────────────┐
│  Modal Header                           │
│  ├─ Title: "Connect Wallet"             │
│  └─ Close Button (X)                    │
├─────────────────────────────────────────┤
│  Wallet Options                         │
│  ┌──────────────────┐                   │
│  │  MetaMask        │  [Icon]            │
│  └──────────────────┘                   │
│  ┌──────────────────┐                   │
│  │  WalletConnect   │  [Icon]            │
│  └──────────────────┘                   │
│  ┌──────────────────┐                   │
│  │  Coinbase Wallet │  [Icon]            │
│  └──────────────────┘                   │
│  ┌──────────────────┐                   │
│  │  Trust Wallet    │  [Icon]            │
│  └──────────────────┘                   │
│                                         │
│  [Embedded Wallet Option - Phase 2]    │
│  ┌──────────────────┐                   │
│  │  Create Wallet   │  [Icon]            │
│  │  (Email/Google)  │                    │
│  └──────────────────┘                   │
├─────────────────────────────────────────┤
│  Footer                                 │
│  └─ "Learn more about wallets" Link     │
└─────────────────────────────────────────┘
```

#### Key Components
- **Wallet Option Cards**: Large, clickable cards with icons
- **Embedded Wallet Option**: Highlighted for newcomers (Phase 2)
- **Help Link**: Educational content about wallets

#### Interaction Specifications
- **Wallet Selection**: Click wallet card → Connection initiated
- **QR Code**: WalletConnect → QR code displayed
- **Connection Status**: Loading indicator during connection
- **Error Handling**: Error message displayed if connection fails

---

### Screen 3: Payment Confirmation
**Design Reference**: `Dapp Confirmation (Payment) Details.png`  
**Priority**: Must-Have (MVP)  
**User Flow**: Flow B

#### Layout Structure
```
┌─────────────────────────────────────────┐
│  Modal Header                           │
│  ├─ Title: "Confirm Payment"            │
│  └─ Close Button (X)                    │
├─────────────────────────────────────────┤
│  Transaction Details                    │
│  ├─ Amount                              │
│  │   └─ 0.5 ETH                         │
│  ├─ Recipient                           │
│  │   └─ 0x1234...5678                   │
│  │   └─ [Copy Address]                  │
│  ├─ Network                             │
│  │   └─ Ethereum Mainnet                │
│  ├─ Gas Fee                             │
│  │   └─ 0.002 ETH (~$4.50)              │
│  └─ Total                               │
│      └─ 0.502 ETH (~$1,004.50)          │
├─────────────────────────────────────────┤
│  Transaction Preview                    │
│  └─ [Transaction Summary]               │
├─────────────────────────────────────────┤
│  Action Buttons                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │   Cancel     │  │   Confirm    │    │
│  └──────────────┘  └──────────────┘    │
└─────────────────────────────────────────┘
```

#### Key Components
- **Transaction Details**: Clear breakdown of payment
- **Gas Fee Display**: Estimated gas with USD equivalent
- **Total Calculation**: Sum of amount + gas fee
- **Action Buttons**: Clear primary (Confirm) and secondary (Cancel) actions

#### Interaction Specifications
- **Confirm**: Click → Wallet prompts for signing
- **Cancel**: Click → Close modal, return to payment form
- **Copy Address**: Click → Copy recipient address to clipboard
- **Network Selection**: Click → Change network (if needed)

---

### Screen 4: Token Swap Interface
**Design Reference**: `Swap.png`  
**Priority**: Should-Have (Phase 2)  
**User Flow**: Flow C

#### Layout Structure
```
┌─────────────────────────────────────────┐
│  Header                                 │
│  ├─ Title: "Swap Tokens"                │
│  └─ Settings Icon                       │
├─────────────────────────────────────────┤
│  Swap Interface                         │
│  ┌─────────────────────────────┐        │
│  │  From                       │        │
│  │  ┌─────────┐  ┌──────────┐ │        │
│  │  │ 0.5     │  │  ETH  ▼  │ │        │
│  │  └─────────┘  └──────────┘ │        │
│  │  Balance: 1.5 ETH           │        │
│  └─────────────────────────────┘        │
│           ↕ Swap Button                 │
│  ┌─────────────────────────────┐        │
│  │  To                         │        │
│  │  ┌─────────┐  ┌──────────┐ │        │
│  │  │ 1,200   │  │  USDT ▼  │ │        │
│  │  └─────────┘  └──────────┘ │        │
│  │  ≈ $1,200                   │        │
│  └─────────────────────────────┘        │
│  Exchange Rate                          │
│  └─ 1 ETH = 2,400 USDT                 │
│  ┌─────────────────────────────┐        │
│  │  Slippage Tolerance: 0.5%   │        │
│  └─────────────────────────────┘        │
│  Gas Fee Estimate                       │
│  └─ ~$2.50                              │
├─────────────────────────────────────────┤
│  Action Button                          │
│  ┌─────────────────────────────┐        │
│  │      Swap Tokens            │        │
│  └─────────────────────────────┘        │
└─────────────────────────────────────────┘
```

#### Key Components
- **From/To Token Selectors**: Token amount inputs with dropdowns
- **Swap Button**: Icon button to swap from/to tokens
- **Exchange Rate Display**: Real-time rate calculation
- **Slippage Settings**: Configurable slippage tolerance
- **Gas Fee Display**: Estimated gas cost

#### Interaction Specifications
- **Token Selection**: Click token dropdown → Select token
- **Amount Input**: Type amount → Auto-calculate output
- **Swap Direction**: Click swap button → Swap from/to
- **Slippage**: Click settings → Adjust slippage tolerance
- **Confirm Swap**: Click button → Confirm transaction

---

### Screen 5: Marketplace
**Design Reference**: `Market Place.png`  
**Priority**: Should-Have (Phase 2)  
**User Flow**: Flow 4.1

#### Layout Structure
```
┌─────────────────────────────────────────┐
│  Header                                 │
│  ├─ Logo                                │
│  ├─ Search Bar                          │
│  └─ Cart Icon (with count)              │
├─────────────────────────────────────────┤
│  Filters & Categories                   │
│  ├─ Category Tabs                       │
│  └─ Filter Options                      │
├─────────────────────────────────────────┤
│  Product Grid                           │
│  ┌──────┐  ┌──────┐  ┌──────┐          │
│  │ Prod │  │ Prod │  │ Prod │          │
│  │  1   │  │  2   │  │  3   │          │
│  └──────┘  └──────┘  └──────┘          │
│  ┌──────┐  ┌──────┐  ┌──────┐          │
│  │ Prod │  │ Prod │  │ Prod │          │
│  │  4   │  │  5   │  │  6   │          │
│  └──────┘  └──────┘  └──────┘          │
├─────────────────────────────────────────┤
│  Pagination                             │
│  └─ [1] [2] [3] ... [Next]             │
└─────────────────────────────────────────┘
```

#### Key Components
- **Search Bar**: Product search functionality
- **Category Filters**: Filter by product category
- **Product Cards**: Image, title, price, quick add
- **Cart Indicator**: Shows items in cart
- **Pagination**: Navigate through product pages

#### Product Card Structure
```
┌─────────────────┐
│  [Product Image] │
│                  │
├─────────────────┤
│  Product Name   │
│  Description    │
│  Price: 0.1 ETH │
│  [Add to Cart]  │
└─────────────────┘
```

---

### Screen 6: Token Management
**Design Reference**: `My Token Available.png`  
**Priority**: Should-Have (Phase 2)  
**User Flow**: Flow 1.3

#### Layout Structure
```
┌─────────────────────────────────────────┐
│  Header                                 │
│  ├─ Title: "My Tokens"                  │
│  └─ Refresh Button                      │
├─────────────────────────────────────────┤
│  Portfolio Summary                      │
│  └─ Total Value: $5,234.56             │
├─────────────────────────────────────────┤
│  Chain Filter                           │
│  └─ [All] [Ethereum] [Polygon] [BSC]   │
├─────────────────────────────────────────┤
│  Token List                             │
│  ┌──────────────────────────────────┐  │
│  │  ETH     1.5 ETH    $3,000.00    │  │
│  │  └─ Ethereum Mainnet             │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │  USDT    2,000 USDT  $2,000.00   │  │
│  │  └─ Polygon Mainnet              │  │
│  └──────────────────────────────────┘  │
│  ┌──────────────────────────────────┐  │
│  │  + Add Custom Token              │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

#### Key Components
- **Portfolio Summary**: Total value across all chains
- **Chain Filter**: Filter tokens by blockchain
- **Token List Items**: Token symbol, amount, value, chain
- **Add Token Button**: Add custom tokens

---

## 🧩 Component Specifications

### Button Components

#### Primary Button
- **Size**: Height 48px (mobile), 44px (desktop)
- **Style**: Solid background, white text
- **States**: Default, Hover, Active, Disabled, Loading
- **Accessibility**: WCAG 2.1 AA contrast, keyboard focusable

#### Secondary Button
- **Size**: Height 48px (mobile), 44px (desktop)
- **Style**: Outlined border, transparent background
- **States**: Default, Hover, Active, Disabled
- **Accessibility**: WCAG 2.1 AA contrast, keyboard focusable

### Input Components

#### Text Input
- **Size**: Height 48px minimum
- **Style**: Border, padding, clear focus state
- **States**: Default, Focus, Error, Disabled
- **Accessibility**: Proper labels, error messages, ARIA attributes

#### Token Amount Input
- **Size**: Height 56px (larger for visibility)
- **Style**: Large font, number input formatting
- **Features**: Max button, balance display
- **Validation**: Numeric only, max balance check

### Modal Components

#### Modal Dialog
- **Size**: Max width 500px (mobile), 600px (desktop)
- **Style**: Centered, backdrop overlay
- **Accessibility**: Focus trap, ESC to close, ARIA modal attributes
- **Animation**: Fade in/out, slide up

---

## 📐 Layout Specifications

### Grid System
- **Mobile**: 4-column grid, 16px gutters
- **Tablet**: 8-column grid, 24px gutters
- **Desktop**: 12-column grid, 32px gutters

### Spacing Scale
- **Base Unit**: 4px
- **Scale**: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px

### Container Widths
- **Mobile**: Full width (with padding)
- **Tablet**: Max 768px
- **Desktop**: Max 1200px

---

## 🎨 Visual Hierarchy

### Typography Scale
- **H1**: 32px (mobile), 40px (desktop)
- **H2**: 24px (mobile), 32px (desktop)
- **H3**: 20px (mobile), 24px (desktop)
- **Body**: 16px
- **Small**: 14px
- **Caption**: 12px

### Color Usage (Extracted from Mockups)
- **Primary**: [To be extracted from mockups]
- **Secondary**: [To be extracted from mockups]
- **Success**: Green for successful transactions
- **Error**: Red for errors and warnings
- **Warning**: Yellow/Orange for warnings
- **Text**: Dark for primary text, gray for secondary

---

## ♿ Accessibility Specifications

### WCAG 2.1 AA Compliance
- **Color Contrast**: Minimum 4.5:1 for text, 3:1 for UI components
- **Focus Indicators**: 2px outline, high contrast
- **Touch Targets**: Minimum 44x44px (mobile)
- **Keyboard Navigation**: All interactive elements accessible
- **Screen Readers**: Proper ARIA labels and roles

### Responsive Design
- **Mobile First**: Design for mobile, enhance for desktop
- **Breakpoints**: 768px (tablet), 1024px (desktop)
- **Touch Optimization**: Large targets, spacing for touch
- **Viewport**: Proper viewport meta tags

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-05  
**Next Review**: After design system extraction and validation

