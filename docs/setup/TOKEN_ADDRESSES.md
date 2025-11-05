# 🪙 Token Contract Addresses - RVMplus Dapps

## 📍 All Token Addresses (Stored in Environment Variables)

### **BNB Smart Chain Mainnet (Chain ID: 56)**

| Token | Symbol | Contract Address | ENV Variable |
|-------|--------|------------------|--------------|
| **Tether USD** | USDT | `0x55d398326f99059fF775485246999027B3197955` | `NEXT_PUBLIC_USDT_TOKEN_ADDRESS` |
| **USD1** | USD1 | `0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82` | `NEXT_PUBLIC_USD1_TOKEN_ADDRESS` |
| **RVM Token** | RVM | `0x0000000000000000000000000000000000000000` | `NEXT_PUBLIC_RVM_TOKEN_ADDRESS` |
| **RVM Swap Contract** | - | `0x0000000000000000000000000000000000000000` | `NEXT_PUBLIC_RVM_SWAP_CONTRACT` |

### **BNB Smart Chain Testnet (Chain ID: 97)**

| Token | Symbol | Contract Address | ENV Variable |
|-------|--------|------------------|--------------|
| **USDC Testnet** | USDC | `0x31873b5804bABE258d6ea008f55e08DD00b7d51E` | `NEXT_PUBLIC_USDC_TESTNET_ADDRESS` |

---

## 🔧 Environment Variable Configuration

### **.env.local** (Your Actual Values)
```bash
# Privy Authentication
NEXT_PUBLIC_PRIVY_APP_ID=cmhj5egoh00lmjm0cdu57d2ja
NEXT_PUBLIC_PRIVY_CLIENT_ID=client-WY6SUcpGx59dgr9C73d59HvjevCkyudGZ75wqRRtE4Urc

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=1478687c5ec68d46a47d17c941950005

# Token Addresses - BSC Mainnet
NEXT_PUBLIC_USDT_TOKEN_ADDRESS=0x55d398326f99059fF775485246999027B3197955
NEXT_PUBLIC_USD1_TOKEN_ADDRESS=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82
NEXT_PUBLIC_RVM_TOKEN_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_RVM_SWAP_CONTRACT=0x0000000000000000000000000000000000000000

# Token Addresses - BSC Testnet
NEXT_PUBLIC_USDC_TESTNET_ADDRESS=0x31873b5804bABE258d6ea008f55e08DD00b7d51E
```

### **.env** (Template with Placeholders)
```bash
# Privy Authentication
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id-here
NEXT_PUBLIC_PRIVY_CLIENT_ID=client-your-client-id-here

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id-here

# Token Addresses - BSC Mainnet
NEXT_PUBLIC_USDT_TOKEN_ADDRESS=0x55d398326f99059fF775485246999027B3197955
NEXT_PUBLIC_USD1_TOKEN_ADDRESS=0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82
NEXT_PUBLIC_RVM_TOKEN_ADDRESS=0x0000000000000000000000000000000000000000
NEXT_PUBLIC_RVM_SWAP_CONTRACT=0x0000000000000000000000000000000000000000

# Token Addresses - BSC Testnet
NEXT_PUBLIC_USDC_TESTNET_ADDRESS=0x31873b5804bABE258d6ea008f55e08DD00b7d51E
```

---

## 🎯 How Token Addresses Are Used

### **Smart Network Detection**

The app automatically uses the correct token address based on the connected network:

```typescript
// In app/swap/page.tsx
const TOKEN_ADDRESSES = {
  USDT: process.env.NEXT_PUBLIC_USDT_TOKEN_ADDRESS,           // Mainnet
  USDC_TESTNET: process.env.NEXT_PUBLIC_USDC_TESTNET_ADDRESS, // Testnet
  USD1: process.env.NEXT_PUBLIC_USD1_TOKEN_ADDRESS,           // Mainnet
  RVM_CONTRACT: process.env.NEXT_PUBLIC_RVM_SWAP_CONTRACT     // Both
};

// Smart balance fetching
const { data: usdtBalance } = useBalance({ 
  address,
  token: chainId === 97 
    ? TOKEN_ADDRESSES.USDC_TESTNET  // Use USDC on testnet
    : TOKEN_ADDRESSES.USDT          // Use USDT on mainnet
});
```

### **User Experience:**

**On BSC Testnet (Chain ID 97):**
```
USDT Button → Uses USDC (0x31873b5804bABE258d6ea008f55e08DD00b7d51E)
Balance: 150.50 USDC
Required: 100.00 USDC
```

**On BSC Mainnet (Chain ID 56):**
```
USDT Button → Uses USDT (0x55d398326f99059fF775485246999027B3197955)
Balance: 150.50 USDT
Required: 100.00 USDT
```

---

## 🚀 Faucet Integration

### **BSC Testnet USDC Faucet**

**API Endpoint:**
```
POST https://testnet-operator-evm.orderly.org/v1/faucet/usdc
```

**Payload:**
```json
{
  "chain_id": "97",
  "user_address": "{wallet_address}",
  "broker_id": "demo"
}
```

**Token Received:**
- Contract: `0x31873b5804bABE258d6ea008f55e08DD00b7d51E`
- Symbol: USDC
- Network: BSC Testnet (97)
- Amount: Varies (typically 100-1000 USDC)

---

## 🔄 Updating Token Addresses

### **Method 1: Edit .env.local Directly**
```bash
nano .env.local
# Update the address
# Save and restart dev server
```

### **Method 2: Use Echo Command**
```bash
echo 'NEXT_PUBLIC_USDC_TESTNET_ADDRESS=0xNEW_ADDRESS_HERE' >> .env.local
npm run dev
```

### **Method 3: Replace Existing Value**
```bash
sed -i '' 's/NEXT_PUBLIC_USDC_TESTNET_ADDRESS=.*/NEXT_PUBLIC_USDC_TESTNET_ADDRESS=0xNEW_ADDRESS/' .env.local
npm run dev
```

⚠️ **After any change to .env.local:**
1. Restart dev server: `npm run dev`
2. Hard refresh browser: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

---

## 📊 Token Address Verification

### **Verify on BSCScan:**

**Mainnet:**
- USDT: https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955
- USD1: https://bscscan.com/token/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82

**Testnet:**
- USDC: https://testnet.bscscan.com/token/0x31873b5804bABE258d6ea008f55e08DD00b7d51E

---

## 🎁 Testing Flow with Faucet

### **Step-by-Step:**

1. **Connect Wallet** (MetaMask)
2. **Switch to BSC Testnet** (Chain ID 97)
   - Orange prompt appears if on wrong network
   - Click "Switch Network"
3. **Claim Free USDC**
   - Go to `/swap` page
   - See purple "Testnet Faucet" card
   - Click "Claim Free USDC"
   - Wait for confirmation
   - USDC appears in wallet
4. **Check Balance**
   - Balance shows: "150.50 USDC" (auto-fetched)
5. **Perform Swap**
   - Select USDT button (uses USDC on testnet)
   - Select tier (11,000 / 22,200 / 56,000 RVM)
   - Click "SWAP NOW"
   - Approve USDC spending (Step 1 of 2)
   - Confirm swap (Step 2 of 2)
   - Receive RVM tokens ✅

---

## 🔐 Security Notes

- ✅ All token addresses are **public blockchain data** (safe to commit)
- ✅ Private keys **NEVER** stored in environment variables
- ✅ Privy App ID is **public** (safe to expose)
- ⚠️ RVM contract addresses are **placeholders** (update when deployed)
- ⚠️ `.env.local` is git-ignored (never committed to repository)

---

## 📝 Adding New Tokens

To add a new token to the swap interface:

1. **Get Token Address** from BSCScan
2. **Add to .env.local:**
   ```bash
   NEXT_PUBLIC_YOUR_TOKEN_ADDRESS=0x...
   ```
3. **Update app/swap/page.tsx:**
   ```typescript
   const TOKEN_ADDRESSES = {
     // ... existing tokens
     YOUR_TOKEN: process.env.NEXT_PUBLIC_YOUR_TOKEN_ADDRESS as `0x${string}`,
   };
   ```
4. **Add balance hook:**
   ```typescript
   const { data: yourTokenBalance } = useBalance({ 
     address,
     token: TOKEN_ADDRESSES.YOUR_TOKEN
   });
   ```
5. **Add swap button** in the UI

---

## 🌐 Network Support

| Network | Chain ID | Supported Tokens | Status |
|---------|----------|------------------|--------|
| **BSC Mainnet** | 56 | BNB, USDT, USD1, RVM | ✅ Active |
| **BSC Testnet** | 97 | tBNB, USDC (Faucet) | ✅ Active |

---

**💡 Tip:** When deploying to production, update all placeholder addresses (`0x000...`) with your actual deployed contract addresses!

