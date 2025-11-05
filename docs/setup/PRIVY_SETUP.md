# Privy Integration Setup Guide

## ✅ Privy Integration - React SDK (Web)

Based on [Privy's App Clients documentation](https://docs.privy.io/basics/get-started/dashboard/app-clients):

> "This step is **optional** if you're using the React SDK. App clients are required for all other mobile and non-web platforms."

### Your Configuration:

**Privy App ID** (Required)
```
cmhj5egoh00lmjm0cdu57d2ja
```
✅ **Status**: Configured correctly
✅ **Purpose**: Main authentication identifier

**Privy Client ID** (Optional for React SDK)
```
client-WY6SUcpGx59dgr9C73d59HvjevCkyudGZ75wqRRtE4Urc
```
✅ **Status**: Configured for advanced features
✅ **Purpose**: Platform-specific settings (cookies, origins, session duration)
✅ **Note**: Settings are managed in Privy Dashboard, not in code

## 🔧 Environment Variables (Fully Configured)

Your `.env.local` file includes:

```bash
# App ID - Main authentication identifier
NEXT_PUBLIC_PRIVY_APP_ID=cmhj5egoh00lmjm0cdu57d2ja

# Client ID - Platform-specific configuration
NEXT_PUBLIC_PRIVY_CLIENT_ID=client-WY6SUcpGx59dgr9C73d59HvjevCkyudGZ75wqRRtE4Urc

# WalletConnect integration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=1478687c5ec68d46a47d17c941950005
```

## 🎯 Current Configuration

### Login Methods (Prioritized Web3)
✅ **Wallet** - Primary method (MetaMask, WalletConnect, Trust Wallet, etc.)
✅ **Email** - Email-based login
✅ **SMS** - Phone number login  
✅ **Google** - Social login

### Supported Chains
✅ **BNB Smart Chain** (Primary)
✅ **Ethereum** (Secondary)

### Cookie Settings
✅ **Enabled** - Cookies are enabled on base domain
✅ **SameSite**: `lax`
✅ **Secure**: `true`

### Embedded Wallets
✅ **Auto-create**: For users without wallets
✅ **No password required**: Simplified onboarding

### Appearance
- **Theme**: Light
- **Accent Color**: `#14b8a6` (Teal - matches RVMPlus theme)
- **Supported Wallets**: MetaMask, WalletConnect, Coinbase Wallet, Rainbow

## 🚨 CRITICAL: Add Localhost to Allowed Origins

**The 403 Forbidden error occurs because `http://localhost:3000` is not in your allowed origins.**

### Steps to Fix in Privy Dashboard:

1. **Go to**: https://dashboard.privy.io
2. **Navigate to**: Configuration → App settings → **Clients tab**
3. **Find your client**: `client-WY6SUcpGx59dgr9C73d59HvjevCkyudGZ75wqRRtE4Urc`
4. **Add to "Allowed origins"**:
   ```
   http://localhost:3000
   http://localhost:3001
   ```
5. **Click "Save Changes"**
6. **Restart your dev server**

### Why This is Needed:

According to [Privy's App Clients documentation](https://docs.privy.io/basics/get-started/dashboard/app-clients):
- Each app client has a set of **allowed origins**
- Requests from origins NOT in this list will be **rejected with 403**
- For development, you must add `http://localhost:3000`
- For production, add your actual domain (e.g., `https://rvmplus.com`)

## 🔄 How to Test (After Adding Allowed Origins)

1. **Add `http://localhost:3000`** to Privy dashboard allowed origins ⚠️ **REQUIRED**
2. **Restart dev server**: `npm run dev`
3. **Hard refresh browser**: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
4. **Navigate to home page**: http://localhost:3000
5. **Disconnect wallet** (if connected)
6. **Click "Connect Wallet"** button
7. **You should see**:
   - Privy modal with wallet options
   - MetaMask login works without 403 error
   - Web3 wallets prioritized at top

## 🚀 Production Deployment

### Privy Dashboard Settings (Already Configured)
✅ Client ID set
✅ Cookies enabled
✅ Web3 prioritized
✅ Allowed origins: Configure for your production domain

### Before Going Live:
1. Add your production domain to "Allowed origins" in Privy dashboard
2. Update RVM contract addresses in `.env.local`
3. Test all wallet connection flows
4. Verify cookie consent banner appears

## 📝 Notes

- Privy is now **ENABLED** (no longer disabled in development mode)
- Web3 wallets are **prioritized** as per your dashboard settings
- Cookies will work on your base domain
- All CSP headers already configured for Privy

## 🔗 Privy Dashboard

Access your Privy dashboard at: https://dashboard.privy.io

**Your Privy App ID:** `cmhj5egoh00lmjm0cdu57d2ja`
**Your Client ID:** `client-WY6SUcpGx59dgr9C73d59HvjevCkyudGZ75wqRRtE4Urc`

