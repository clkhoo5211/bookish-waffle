# 🔧 Next.js Configuration Explained

## Problem & Solution

### ❌ **Previous Issue:**
- GitHub Pages was serving `README.md` as a Jekyll site
- Your actual Next.js app wasn't being deployed
- Build was hanging due to webpack caching issues

### ✅ **Current Solution:**
Unified `next.config.js` that automatically detects environment and applies correct settings.

---

## Configuration Modes

### 1. **Local Development** (`npm run dev`)
```bash
$ npm run dev
# Uses: NODE_ENV=development, no NEXT_PUBLIC_BASE_PATH
```

**Settings Applied:**
- ✅ **CSP Headers**: Full Content-Security-Policy for Web3
- ✅ **PWA**: Disabled (faster development)
- ✅ **Base Path**: None (runs on root `/`)
- ✅ **Images**: Optimized
- ✅ **Output**: Server mode (not static)

**CSP Domains Whitelisted:**
- Privy (`*.privy.io`)
- WalletConnect (`*.walletconnect.com`)
- MetaMask (`*.metamask.io`)
- Binance RPC (`*.binance.org`, `*.thirdweb.com`)
- Cloudflare Turnstile (`challenges.cloudflare.com`)
- YouTube embeds (`youtube.com`)
- All BSC Testnet/Mainnet RPCs

**Access**: `http://localhost:3000`

---

### 2. **GitHub Pages Deployment** (`npm run build` with env var)
```bash
$ NEXT_PUBLIC_BASE_PATH=/bookish-waffle npm run build
# Used by: GitHub Actions workflow
```

**Settings Applied:**
- ✅ **Static Export**: `output: 'export'`
- ✅ **Base Path**: `/bookish-waffle` (subdirectory)
- ✅ **PWA**: Disabled (incompatible with static export)
- ✅ **Images**: Unoptimized (required for static)
- ✅ **CSP Headers**: Disabled (configure at GitHub Pages level)
- ✅ **Webpack Cache**: Disabled (prevents hanging)

**Output**: `/out` directory with 16 HTML pages

**Access**: `https://clkhoo5211.github.io/bookish-waffle/`

---

## How Detection Works

```javascript
const isStaticExport = !!process.env.NEXT_PUBLIC_BASE_PATH;
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment && !isStaticExport) {
  // Apply CSP headers for local dev
  nextConfig.headers = async () => { ... };
}
```

**Logic**:
- `npm run dev` → isDevelopment = true, isStaticExport = false → **CSP headers applied**
- `npm run build` (local) → isDevelopment = false, isStaticExport = false → **No CSP**
- `NEXT_PUBLIC_BASE_PATH=/bookish-waffle npm run build` → isStaticExport = true → **Static export mode**

---

## Files Generated

### Local Development
```
.next/          # Build cache (not deployed)
public/         # Static assets
```

### GitHub Pages Deployment
```
out/
├── index.html              # Home page
├── marketplace.html        # Marketplace
├── swap.html               # Swap page with faucet
├── tokens.html             # Tokens page
├── transactions.html       # Transactions
├── qr-standee.html         # QR standee
├── payment.html            # Payment
├── link-apps.html          # App linking
├── .nojekyll               # Prevents Jekyll processing
├── _next/                  # JS/CSS bundles
├── logos/                  # Cryptocurrency logos
└── manifest.json           # PWA manifest
```

---

## Why Separate Configs?

### 1. **CSP Headers**
- ❌ **Incompatible** with `output: 'export'`
- ✅ **Only work** in Next.js server mode
- 💡 **Solution**: Apply only in dev mode

### 2. **PWA (Service Worker)**
- ❌ **Incompatible** with static export
- ⚠️ **Causes build to hang**
- 💡 **Solution**: Disable for GitHub Pages

### 3. **Webpack Caching**
- ⚠️ **Causes build to hang** during static export
- ✅ **Set to false** to ensure builds complete

---

## Testing Both Configs

### Test Local Dev (with CSP):
```bash
npm run dev
# Visit: http://localhost:3000
# Check console: curl -I http://localhost:3000 | grep Content-Security-Policy
```

**Expected**:
- ✅ CSP header present
- ✅ All Web3 connections allowed
- ✅ MetaMask/WalletConnect work
- ✅ No CORS errors

---

### Test Static Export (for GitHub Pages):
```bash
NEXT_PUBLIC_BASE_PATH=/bookish-waffle npm run build
ls out/
```

**Expected**:
- ✅ `/out` directory created
- ✅ 16 HTML files generated
- ✅ `404.html` for error handling
- ✅ `.nojekyll` file present
- ✅ `_next/` with all assets

---

## Deployment Workflow

### GitHub Actions (`.github/workflows/deploy-pages.yml`):
1. Checkout code
2. Install dependencies (`npm ci`)
3. Build with: `NEXT_PUBLIC_BASE_PATH=/bookish-waffle npm run build`
4. Upload `/out` directory to GitHub Pages
5. Deploy to: https://clkhoo5211.github.io/bookish-waffle/

**Removed workflows**:
- ❌ `deploy-vercel.yml` (Deleted - not needed)

---

## Network Configuration (BSC Testnet Priority)

```typescript
// lib/web3/config.ts
supportedChains = [
  bscTestnet,  // ← FIRST = Default for all deployments
  bsc,         // ← Mainnet (fallback)
  mainnet,
  polygon,
  ...
]
```

**Behavior**:
- ✅ App defaults to **BSC Testnet (Chain ID 97)**
- ✅ Network checker prompts if wrong network
- ✅ Auto-switches to testnet
- ✅ Faucet button on `/swap` page for free USDC

---

## Summary

| Environment | npm Command | Output | CSP | PWA | Base Path |
|-------------|-------------|--------|-----|-----|-----------|
| **Local Dev** | `npm run dev` | Server | ✅ Yes | ❌ No | None |
| **Local Build** | `npm run build` | Server | ❌ No | ❌ No | None |
| **GitHub Pages** | `npm run build` + env | Static | ❌ No | ❌ No | `/bookish-waffle` |

---

## Quick Commands

```bash
# Start local development
npm run dev

# Build for GitHub Pages (manual test)
NEXT_PUBLIC_BASE_PATH=/bookish-waffle npm run build

# View build output
ls -la out/

# Test local build
npm run build && npm run start

# Lint code
npm run lint

# Type check
npm run type-check
```

---

## Troubleshooting

### Build hanging?
- ✅ **Already fixed**: Webpack cache disabled in config

### CSP headers not working locally?
- Check: `curl -I http://localhost:3000 | grep Content-Security-Policy`
- Should show full CSP with all Web3 domains

### GitHub Pages showing README?
- ✅ **Already fixed**: `.nojekyll` file added to `/out`
- Next deployment will show the app

### Wrong network on deployment?
- ✅ **Already configured**: BSC Testnet is first in chain list
- Network checker will auto-prompt users

---

**All configurations verified and working!** ✅

