# 🆓 FREE Testnet Development Guide
## Complete Testing Strategy for On-Ramp & Smart Accounts

**Created**: 2025-11-06  
**Status**: ✅ All Development Can Be Done FREE on Testnet  
**Target**: BSC Testnet (Chain ID 97)

---

## 🎯 **EXECUTIVE SUMMARY**

**✅ YES - 100% FREE TESTING AVAILABLE!**

You can develop and test ALL features completely free using:
1. **BSC Testnet** - Free test BNB/tokens
2. **Reown Testnet On-Ramp** - Test credit cards (no real charges)
3. **Testnet Faucets** - Free test tokens
4. **Pimlico Testnet** - Free bundler/paymaster
5. **Social Login** - Free on testnet

**NO REAL MONEY REQUIRED for development!** 🎉

---

## 💰 **FREE TESTNET OPTIONS**

### **1. BSC Testnet (Chain ID 97) - PRIMARY TESTNET**

**Status**: ✅ Already Configured in Your Project

#### **Get Free Test BNB:**

**Option A: Official BSC Faucet**
```bash
# Visit: https://testnet.bnbchain.org/faucet-smart
# Or use API:
curl -X POST https://api.bnbchain.org/api/v1/faucet \
  -H "Content-Type: application/json" \
  -d '{"address": "YOUR_WALLET_ADDRESS"}'
```

**Option B: QuickNode Faucet**
```bash
# Visit: https://faucet.quicknode.com/binance/bnb-testnet
# Enter your wallet address
# Get 0.1 BNB instantly
```

**Option C: Chainlink Faucet**
```bash
# Visit: https://faucets.chain.link/bnb-testnet
# Connect wallet or enter address
# Get free test BNB
```

#### **Get Free Test Tokens (USDC/USDT/CAKE):**

⚠️ **Note**: Orderly faucet may have availability issues. Use these alternatives:

**Option A: BSC Testnet Token Faucets (Best Options)**
```bash
# 1. Testnet Faucet (Multiple Tokens)
https://testnet.binance.org/faucet-smart
# Get: Test BNB, USDT, BUSD

# 2. QuickNode Multi-Token Faucet
https://faucet.quicknode.com/binance/bnb-testnet
# Get: BNB + ERC-20 test tokens

# 3. BNB Chain Official Faucet
https://www.bnbchain.org/en/testnet-faucet
# Get: Test BNB (0.1-1.0 BNB per request)
```

**Option B: Deploy Your Own Test Tokens (Easy!)**
```solidity
// Deploy a simple ERC-20 for testing
// Mint unlimited test tokens to yourself
// Takes 5 minutes, costs <$0.01 testnet gas
```

**Option C: Request from Community Faucets**
```bash
# BSC Testnet Discord/Telegram faucets
# Community members share test tokens
```

---

### **2. Reown AppKit Testnet On-Ramp**

**Status**: ✅ FULLY SUPPORTED

#### **Test Credit Cards (NO REAL CHARGES):**

Reown/WalletConnect on-ramp providers use payment processor test environments:

**Stripe Test Card Numbers (Most Common):**
```
✅ SUCCESS CARDS:
- 4242 4242 4242 4242 (Visa - General success)
- 5555 5555 5555 4444 (Mastercard - Success)
- 3782 822463 10005 (American Express)
- 6011 1111 1111 1117 (Discover)

❌ FAILURE CARDS (For Error Testing):
- 4000 0000 0000 0002 (Card Declined)
- 4000 0000 0000 9995 (Insufficient Funds)
- 4000 0000 0000 0069 (Expired Card)
- 4000 0000 0000 0127 (Incorrect CVC)

📋 CARD DETAILS (Use with any test card):
- Expiry: Any future date (e.g., 12/25, 01/30)
- CVC: Any 3 digits (e.g., 123, 456, 789)
- ZIP/Postal: Any 5 digits (e.g., 12345, 90210)
- Name: Any name (e.g., "Test User")
```

**Other Payment Processor Test Cards:**

**Moonpay Test Cards:**
```
✅ 4000 0566 5566 5556 (Visa - Success)
✅ 5436 0310 3060 6378 (Mastercard - Success)
Expiry: 12/25 | CVC: 123
```

**Transak Test Cards:**
```
✅ 4111 1111 1111 1111 (Visa - Success)
✅ 5500 0000 0000 0004 (Mastercard - Success)
Expiry: Any future date | CVC: 123
```

**⚠️ CRITICAL NOTES:**
1. These cards work ONLY in testnet/sandbox/test mode
2. NO real money will be charged
3. Must be in testnet environment (BSC Testnet Chain ID 97)
4. If using mainnet by mistake, cards will fail (protection against accidents)
5. Test transactions appear as "TEST MODE" or "SANDBOX" in provider dashboards

#### **Testnet On-Ramp Configuration:**

```typescript
// In your appkit-config.ts
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  networks: [bscTestnet], // ✅ Use testnet for testing
  projectId: projectId,
  features: {
    smartAccounts: true,
    email: true,
    socials: ['google', 'apple', 'x', 'discord'],
    onramp: true,        // ✅ Works on testnet
    swaps: true,         // ✅ Works on testnet
    exchanges: true,     // ✅ Works on testnet
  },
});
```

#### **Reown Testnet Environment:**

- **Testnet Mode**: Automatically enabled when using `bscTestnet` network
- **Test Cards**: Accepted by payment processors in test mode
- **No Real Charges**: All transactions are simulated
- **Free Testing**: Unlimited test transactions

---

### **3. Pimlico Testnet (Bundler & Paymaster)**

**Status**: ✅ FREE TIER AVAILABLE

#### **Pimlico Testnet Setup:**

**Free Tier Limits:**
- **1,000 UserOperations/month** - FREE
- **Testnet Usage** - Always FREE
- **BSC Testnet** - Fully supported

**Configuration:**
```bash
# .env file
NEXT_PUBLIC_PIMLICO_API_KEY=your_testnet_api_key
NEXT_PUBLIC_PIMLICO_BSC_TESTNET_URL=https://api.pimlico.io/v2/97/rpc
```

**Getting Pimlico Testnet API Key:**
1. Sign up at https://dashboard.pimlico.io
2. Create testnet project
3. Enable BSC Testnet (Chain ID 97)
4. Get API key (FREE for testnet)

**Cost**: **$0/month** for testnet usage ✅

---

### **4. Social Login (Testnet)**

**Status**: ✅ FREE on Testnet

#### **Privy Testnet Configuration:**

```typescript
// lib/web3/providers.tsx
<PrivyProvider
  appId={privyAppId}
  config={{
    defaultChain: bscTestnet,  // ✅ Use testnet
    supportedChains: [bscTestnet],
    embeddedWallets: {
      createOnLogin: 'users-without-wallets',
    },
  }}
>
```

**Cost**: **FREE** for testnet testing ✅

- Google OAuth: Free
- Apple OAuth: Free
- X (Twitter) OAuth: Free
- Email Auth: Free

---

### **5. Smart Accounts (Testnet)**

**Status**: ✅ FREE on Testnet

#### **Smart Account Deployment:**

- **Testnet Deployment**: Free (gas sponsored or very cheap)
- **Testnet Transactions**: Free or <$0.01
- **No Real Costs**: All on testnet

**Cost**: **$0** for testnet ✅

---

## 🎯 **COMPLETE FREE TESTING FLOW**

### **User Flow: Login → Check Balance → Buy if Needed → Transfer**

#### **Step 1: Social Login (FREE)**
```
User clicks "Login with Google"
→ Creates Smart Account on BSC Testnet
→ Cost: $0
```

#### **Step 2: Check Balance (FREE)**
```
Check Smart Account balance:
- If balance exists → Use existing balance ✅
- If insufficient → Show "Buy with Card" button
→ Cost: $0 (just blockchain queries)
```

#### **Step 3: Buy with Card (FREE - Testnet)**
```
User clicks "Buy with Card"
→ Reown on-ramp modal opens
→ User enters test card: 4242 4242 4242 4242
→ Test tokens deposited to Smart Account
→ Cost: $0 (testnet simulation)
```

#### **Step 4: Transfer to Contract (FREE)**
```
Smart Account transfers tokens to your contract
→ Gas sponsored by Pimlico (free tier)
→ Cost: $0
```

**Total Cost for Entire Flow**: **$0** ✅

---

## 📋 **TESTNET CONFIGURATION CHECKLIST**

### **Week 1: Testnet Setup**

- [ ] **BSC Testnet Configuration**
  - [x] Already configured in `lib/web3/config.ts` ✅
  - [ ] Get free test BNB from faucet
  - [ ] Verify testnet connection

- [ ] **Reown Testnet Setup**
  - [ ] Create testnet project on Reown Dashboard
  - [ ] Get testnet project ID
  - [ ] Enable on-ramp features for testnet
  - [ ] Test with test credit cards

- [ ] **Pimlico Testnet Setup**
  - [ ] Sign up for Pimlico (free)
  - [ ] Enable BSC Testnet (Chain ID 97)
  - [ ] Get testnet API key
  - [ ] Configure paymaster for testnet

- [ ] **Privy Testnet Setup**
  - [x] Already configured ✅
  - [ ] Test social login on testnet
  - [ ] Verify Smart Account creation

### **Week 2: Integration Testing**

- [ ] **On-Ramp Testing**
  - [ ] Test credit card purchase flow
  - [ ] Verify test tokens received
  - [ ] Test multiple test cards
  - [ ] Test error scenarios

- [ ] **Balance Checking**
  - [ ] Test existing balance detection
  - [ ] Test insufficient balance handling
  - [ ] Test "Buy if needed" flow

- [ ] **Smart Account Testing**
  - [ ] Test token transfers
  - [ ] Test gasless transactions
  - [ ] Test batch operations

### **Week 3: End-to-End Testing**

- [ ] **Complete User Flow**
  - [ ] Social login → Smart Account creation
  - [ ] Check balance → Insufficient
  - [ ] Buy with card (testnet)
  - [ ] Transfer to contract
  - [ ] Swap execution

- [ ] **Edge Cases**
  - [ ] Multiple purchases
  - [ ] Failed transactions
  - [ ] Network switching
  - [ ] Wallet disconnection

---

## 💡 **TESTING STRATEGY**

### **Balance Logic Implementation:**

```typescript
// Enhanced swap page logic
const handleSwap = async () => {
  // 1. Check if user has Smart Account
  if (!hasSmartAccount) {
    // Force social login
    await login();
    return;
  }

  // 2. Check balance
  const requiredAmount = getRequiredAmount();
  const currentBalance = getCurrentBalance(selectedCurrency);

  if (currentBalance >= requiredAmount) {
    // ✅ Use existing balance
    await performSwap();
  } else {
    // ❌ Insufficient balance - show buy option
    setShowBuyModal(true);
  }
};

// Buy modal component
const BuyModal = () => {
  return (
    <div>
      <h3>Insufficient Balance</h3>
      <p>You need {requiredAmount} {selectedCurrency}</p>
      <p>Current balance: {currentBalance} {selectedCurrency}</p>
      
      {/* Show Reown on-ramp button */}
      <button onClick={openOnRamp}>
        Buy with Credit Card
      </button>
      
      {/* Or use existing balance if partial */}
      {currentBalance > 0 && (
        <button onClick={usePartialBalance}>
          Use {currentBalance} {selectedCurrency} + Buy Rest
        </button>
      )}
    </div>
  );
};
```

---

## 🚀 **QUICK START: FREE TESTNET SETUP**

### **1. Get Test BNB (5 minutes)**

```bash
# Option 1: QuickNode Faucet
# Visit: https://faucet.quicknode.com/binance/bnb-testnet
# Enter your wallet address
# Get 0.1 BNB instantly

# Option 2: Official BSC Faucet
# Visit: https://testnet.bnbchain.org/faucet-smart
# Follow instructions
```

### **2. Get Test Tokens (Already in Your Code!)**

```typescript
// Your swap page already has this!
// Just click "Claim Free USDC" button on BSC Testnet
// It's already working ✅
```

### **3. Configure Reown Testnet**

```typescript
// Update appkit-config.ts
const networks = [bscTestnet]; // Use testnet for testing

export const appKit = createAppKit({
  networks,
  features: {
    onramp: true,  // Enable on-ramp
  },
});
```

### **4. Test On-Ramp Flow**

1. Connect wallet to BSC Testnet
2. Click "Buy with Card"
3. Use test card: `4242 4242 4242 4242`
4. Enter any future expiry date
5. Get test tokens FREE!

---

## 📊 **COST BREAKDOWN**

| Component | Testnet Cost | Mainnet Cost |
|-----------|-------------|--------------|
| **BSC Testnet** | FREE | - |
| **Test BNB/Tokens** | FREE (faucets) | - |
| **Reown On-Ramp** | FREE (test cards) | ~1-3% fee |
| **Pimlico Testnet** | FREE (1k ops/month) | $10-100/month |
| **Social Login** | FREE | FREE |
| **Smart Accounts** | FREE (testnet gas) | ~$0.02-0.04/tx |
| **Development** | FREE | - |

**Total Testnet Cost**: **$0/month** ✅  
**Total Mainnet Cost**: **~$10-100/month** (after launch)

---

## ✅ **VERIFICATION**

### **Testnet Indicators:**

✅ **Correct Network**: BSC Testnet (Chain ID 97)  
✅ **Test Tokens**: No real value  
✅ **Test Cards**: Stripe test numbers work  
✅ **Free Gas**: Sponsored or very cheap  
✅ **Free Faucets**: Unlimited test tokens  

### **Mainnet Indicators:**

⚠️ **Real Network**: BSC Mainnet (Chain ID 56)  
⚠️ **Real Tokens**: Real money  
⚠️ **Real Cards**: Real charges  
⚠️ **Real Gas**: ~$0.02-0.04/tx  
⚠️ **No Faucets**: Must buy real tokens  

---

## 🎯 **RECOMMENDATION**

**✅ Development Strategy:**

1. **Week 1-4**: Test everything on **BSC Testnet** (FREE)
2. **Week 5**: Test with small amounts on **BSC Mainnet** (minimal cost)
3. **Week 6+**: Full mainnet launch

**✅ Testing Budget:**

- **Testnet Development**: $0 (FREE)
- **Testnet Testing**: $0 (FREE)
- **Mainnet Testing**: $50-100 (small amounts)
- **Production Launch**: Revenue-funded

---

## 📚 **RESOURCES**

### **Free Testnet Faucets:**
- BSC Faucet: https://testnet.bnbchain.org/faucet-smart
- QuickNode Faucet: https://faucet.quicknode.com/binance/bnb-testnet
- Chainlink Faucet: https://faucets.chain.link/bnb-testnet
- Orderly Faucet: Already in your code! ✅

### **Test Credit Cards:**
- Stripe Test Cards: https://stripe.com/docs/testing
- Test Card Numbers: `4242 4242 4242 4242` (success)

### **Testnet Documentation:**
- Reown Testnet: https://docs.reown.com/appkit/react/core/custom-networks
- BSC Testnet: https://docs.bnbchain.org/docs/rpc
- Pimlico Testnet: https://docs.pimlico.io/guides/supported-chains

---

## 🎉 **CONCLUSION**

**✅ YES - 100% FREE TESTING AVAILABLE!**

You can develop and test ALL features completely free on BSC Testnet:
- ✅ Social login → Smart Account creation
- ✅ Balance checking → Buy if needed
- ✅ On-ramp with test credit cards
- ✅ Token transfers to contracts
- ✅ Gasless transactions via Pimlico

**NO REAL MONEY REQUIRED for development!** 🚀

**Recommended**: Start on testnet, test thoroughly, then move to mainnet for production.

---

**Status**: ✅ Ready for FREE testnet development  
**Next Step**: Set up testnet environment and start testing!  
**Cost**: $0/month for testnet development

