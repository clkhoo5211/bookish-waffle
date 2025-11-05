# 🌐 Environment-Based Network Switching

## ✅ Fixed TypeScript Error

**Problem:**
```
Type '({ blockExplorers: ... })[]' is not assignable to type '[AppKitNetwork, ...AppKitNetwork[]]'.
Source provides no match for required element at position 0 in target.
```

**Solution:**
```typescript
import type { AppKitNetwork } from '@reown/appkit/networks';

const networks: [AppKitNetwork, ...AppKitNetwork[]] = isDevelopment
  ? [bscTestnet, bsc, ...]
  : [bsc, bscTestnet, ...];
```

The array now has the explicit tuple type `[AppKitNetwork, ...AppKitNetwork[]]` which guarantees at least one element (required by Reown AppKit).

---

## 🔄 Automatic Network Selection

### **How It Works:**

```typescript
// lib/web3/appkit-config.ts
const isDevelopment = process.env.NODE_ENV === 'development';

const networks: [AppKitNetwork, ...AppKitNetwork[]] = isDevelopment
  ? [bscTestnet, bsc, mainnet, polygon, arbitrum, optimism, base]  // Dev: Testnet first
  : [bsc, bscTestnet, mainnet, polygon, arbitrum, optimism, base];  // Prod: Mainnet first
```

### **Network Priority:**

| Command | NODE_ENV | First Network | Default Chain ID |
|---------|----------|---------------|------------------|
| `npm run dev` | `development` | **BSC Testnet** | 97 |
| `npm run build` | `production` | **BSC Mainnet** | 56 |

---

## 🎯 Network Checker Behavior

### **Component: NetworkChecker.tsx**

```typescript
const isDevelopment = process.env.NODE_ENV === 'development';
const targetNetworkId = isDevelopment ? BSC_TESTNET_ID : BSC_MAINNET_ID;
const targetNetworkName = isDevelopment ? 'BNB Smart Chain Testnet' : 'BNB Smart Chain';
```

### **User Experience:**

| Environment | Connected Network | Network Checker Shows |
|-------------|-------------------|----------------------|
| **Development** | BSC Mainnet (56) | ⚠️ "Switch to BSC **Testnet**" |
| **Development** | BSC Testnet (97) | ✅ No prompt (correct network) |
| **Production** | BSC Testnet (97) | ⚠️ "Switch to BSC **Mainnet**" |
| **Production** | BSC Mainnet (56) | ✅ No prompt (correct network) |

---

## 🚀 Usage

### **For Development (Testing):**
```bash
npm run dev
```

**Result:**
- ✅ App runs on http://localhost:3000
- ✅ Default network: **BSC Testnet (97)**
- ✅ Network checker prompts for testnet if on mainnet
- ✅ Safe testing with testnet tokens
- ✅ No risk to real funds

### **For Production (Deployment):**
```bash
npm run build
```

**Result:**
- ✅ Static site built to `/out` directory
- ✅ Default network: **BSC Mainnet (56)**
- ✅ Network checker prompts for mainnet if on testnet
- ✅ Production-ready with real tokens
- ✅ Deployed to: https://clkhoo5211.github.io/bookish-waffle/

---

## 📝 Technical Details

### **Environment Detection:**

```typescript
// Three ways to detect environment:

// 1. NODE_ENV (standard)
const isDevelopment = process.env.NODE_ENV === 'development';

// 2. NEXT_PUBLIC_BASE_PATH (static export = production)
const isStaticExport = !!process.env.NEXT_PUBLIC_BASE_PATH;

// 3. Build command
// npm run dev → development = true
// npm run build → development = false (production)
```

### **Files Modified:**

1. **lib/web3/appkit-config.ts**
   - Added `AppKitNetwork` type import
   - Made networks array conditional
   - Testnet first in dev, mainnet first in prod

2. **components/wallet/NetworkChecker.tsx**
   - Added environment detection
   - Dynamic target network based on environment
   - Different prompts for dev vs prod

---

## 🔒 Safety Features

### **Development Mode Safety:**
```
✅ Defaults to testnet → Can't accidentally spend real funds
✅ Testnet tokens are free (use faucets)
✅ Mistakes have no financial consequence
✅ Perfect for testing and debugging
```

### **Production Mode Safety:**
```
✅ Defaults to mainnet → Users transact with real tokens
✅ Network checker warns if on wrong network
✅ Can still switch to testnet if needed (for testing)
✅ Clear visual feedback on current network
```

---

## 🎨 User Interface Changes

### **Network Badge (Home Page):**

**Development:**
```
┌─────────────────────────────┐
│  🟡 BNB Smart Chain Testnet │
└─────────────────────────────┘
```

**Production:**
```
┌─────────────────────────┐
│  🟡 BNB Smart Chain     │
└─────────────────────────┘
```

### **Network Checker Prompt:**

**Development:**
```
⚠️ Wrong Network Detected
Please switch to BNB Smart Chain Testnet to use RVMPlus Dapps.
[Switch Network] [Dismiss]
```

**Production:**
```
⚠️ Wrong Network Detected
Please switch to BNB Smart Chain to use RVMPlus Dapps.
[Switch Network] [Dismiss]
```

---

## 🧪 Testing

### **Test Development Mode:**
```bash
# 1. Start dev server
npm run dev

# 2. Connect wallet with BSC Mainnet
# Expected: Network checker prompts to switch to testnet

# 3. Switch to BSC Testnet
# Expected: Prompt disappears, app works normally
```

### **Test Production Build:**
```bash
# 1. Build for production
npm run build

# 2. Serve the static site
npx serve out

# 3. Connect wallet with BSC Testnet
# Expected: Network checker prompts to switch to mainnet

# 4. Switch to BSC Mainnet
# Expected: Prompt disappears, app works normally
```

---

## 🌍 Deployment Environments

### **Local Development:**
```
Command: npm run dev
URL: http://localhost:3000
Network: BSC Testnet (97)
Purpose: Safe testing
```

### **GitHub Pages:**
```
Command: npm run build (in CI/CD)
URL: https://clkhoo5211.github.io/bookish-waffle/
Network: BSC Mainnet (56)
Purpose: Production app
```

### **Preview Deployments:**
```
Command: npm run build
URL: Custom domain
Network: BSC Mainnet (56) or BSC Testnet (97) based on env var
Purpose: Staging/Preview
```

---

## 🔑 Environment Variables

### **For Development (.env.local):**
```env
NODE_ENV=development
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=1478687c5ec68d46a47d17c941950005
NEXT_PUBLIC_PRIVY_APP_ID=cmhj5egoh00lmjm0cdu57d2ja
NEXT_PUBLIC_PRIVY_CLIENT_ID=client-WY6SUcpGx59dgr9C73d59HvjevCkyudGZ75wqRRtE4Urc
```

### **For Production (GitHub Secrets):**
```env
# In .github/workflows/deploy-pages.yml:
NEXT_PUBLIC_BASE_PATH=/bookish-waffle
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=${{ secrets.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID }}
NEXT_PUBLIC_PRIVY_APP_ID=${{ secrets.NEXT_PUBLIC_PRIVY_APP_ID }}
NEXT_PUBLIC_PRIVY_CLIENT_ID=${{ secrets.NEXT_PUBLIC_PRIVY_CLIENT_ID }}
```

**Note:** If secrets not set, fallback values used (from deploy-pages.yml).

---

## ✅ Benefits

### **Developer Experience:**
- ✅ Safe testing with testnet tokens
- ✅ No manual network switching needed
- ✅ Clear feedback on expected network
- ✅ Fast iteration with dev server

### **User Experience:**
- ✅ Correct network by default
- ✅ Clear prompts if on wrong network
- ✅ One-click network switching
- ✅ No confusion about which network to use

### **Deployment:**
- ✅ Production always uses mainnet
- ✅ No accidental testnet deploys
- ✅ Environment-aware configuration
- ✅ Consistent behavior across deployments

---

## 🔧 Troubleshooting

### **Network checker not showing correct network:**
```bash
# Check NODE_ENV
echo $NODE_ENV

# Should be 'development' for npm run dev
# Should be 'production' for npm run build
```

### **Wrong network selected by default:**
```bash
# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev

# Or rebuild production
npm run build
```

### **Wallet won't switch networks:**
```bash
# Try manually adding the network:
# 1. Open wallet (MetaMask/Trust/etc.)
# 2. Go to Settings > Networks
# 3. Add BSC Testnet or BSC Mainnet manually
# 4. Retry connection in app
```

---

## 📚 Related Documentation

- **WALLET_INTERACTIONS_VERIFIED.md** - Verified wallet compatibility
- **PRIVY_VERIFICATION.md** - Privy implementation details
- **REOWN_APPKIT_INTEGRATION.md** - WalletConnect setup
- **DEV_VS_PRODUCTION_EXPLAINED.md** - Build configuration differences

---

## 🎯 Summary

| Feature | Before | After |
|---------|--------|-------|
| **Network Selection** | Manual | ✅ Automatic (based on environment) |
| **TypeScript Error** | AppKitNetwork type error | ✅ Fixed with explicit tuple type |
| **Dev Default** | Mainnet | ✅ Testnet (safe) |
| **Prod Default** | Testnet | ✅ Mainnet (correct) |
| **Network Checker** | Static prompt | ✅ Dynamic (dev/prod aware) |
| **Deployment Safety** | Manual verification | ✅ Automatic network detection |

**Result:** ✅ **Safe development, production-ready deployment, environment-aware networking!**

