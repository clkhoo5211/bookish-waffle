# 🪙 Deploy Your Own Test Token - Complete Guide

**Date**: 2025-11-06  
**Purpose**: Create unlimited test tokens for your users  
**Time**: 5 minutes  
**Cost**: ~$0.001 in test BNB

---

## 🎯 **WHY DEPLOY YOUR OWN TEST TOKEN?**

### **Problems with External Faucets:**
- ❌ Often down or rate-limited
- ❌ Require verification (social, reCAPTCHA)
- ❌ Daily limits
- ❌ No programmatic access
- ❌ Unreliable

### **Benefits of Your Own Token:**
- ✅ **Unlimited tokens** - Mint anytime, any amount
- ✅ **Instant** - No waiting or verification
- ✅ **Direct integration** - In-app minting button
- ✅ **Reliable** - Always works
- ✅ **Free** - No ongoing costs
- ✅ **Full control** - You manage it

---

## 🚀 **QUICK DEPLOYMENT (5 MINUTES)**

### **Step 1: Get Tiny Bit of Test BNB (One-Time)**

You only need ~0.01 BNB to deploy the contract.

**Try these (in order):**
1. https://www.bnbchain.org/en/testnet-faucet
2. https://testnet.help/en/bscfaucet/testnet
3. Ask in BSC Discord: https://discord.gg/bnbchain

---

### **Step 2: Deploy Contract (2 minutes)**

**Using Remix IDE (No Installation):**

1. **Open Remix**: https://remix.ethereum.org

2. **Create File**: 
   - Click "+" icon
   - Name: `TestToken.sol`

3. **Paste Code**:
   - Copy from `contracts/TestToken.sol` (I created it for you)
   - Or use this:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TestToken {
    string public name = "Test USDT";
    string public symbol = "tUSDT";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    constructor() {
        _mint(msg.sender, 1_000_000 * 10**decimals);
    }
    
    // ANYONE can mint test tokens (testnet only!)
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        allowance[from][msg.sender] -= amount;
        emit Transfer(from, to, amount);
        return true;
    }
    
    function _mint(address to, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }
}
```

4. **Compile**:
   - Click "Solidity Compiler" tab (left sidebar)
   - Select compiler: 0.8.x
   - Click "Compile TestToken.sol"

5. **Deploy**:
   - Click "Deploy & Run" tab
   - Environment: "Injected Provider - MetaMask"
   - **Make sure MetaMask is on BSC Testnet (Chain ID 97)**
   - Click "Deploy"
   - Confirm in MetaMask
   - Wait 5-10 seconds

6. **Copy Contract Address**:
   - After deployment, copy the contract address
   - Example: `0xABC123...`

---

### **Step 3: Update Your App (1 minute)**

Add the contract address to your environment:

```bash
# .env.local
NEXT_PUBLIC_TEST_TOKEN_ADDRESS=0xYourDeployedContractAddress
```

---

### **Step 4: Add Mint Button to Swap Page (Done!)**

I've created `components/faucet/MintTestTokens.tsx` for you!

**Just add it to your swap page:**

```typescript
// app/swap/page.tsx
import { MintTestTokens } from '@/components/faucet/MintTestTokens';

// In the JSX, add:
{chainId === 97 && <MintTestTokens />}
```

---

## 🎉 **RESULT**

Users will see:

```
┌─────────────────────────────────────┐
│ 🪙 Mint Test Tokens                 │
│ Instant & Unlimited                 │
├─────────────────────────────────────┤
│ Amount to mint: [1000]              │
│                                     │
│ [Mint 1000 Test Tokens]             │
├─────────────────────────────────────┤
│ ✅ Instant minting (no waiting)     │
│ ✅ Unlimited tokens                 │
│ ✅ No verification required         │
│ ✅ Works every time                 │
└─────────────────────────────────────┘
```

**Users click button → Get tokens instantly!**

---

## 📋 **DEPLOYMENT CHECKLIST**

- [ ] Get 0.01 test BNB from any working faucet
- [ ] Open Remix IDE: https://remix.ethereum.org
- [ ] Create `TestToken.sol` file
- [ ] Paste contract code
- [ ] Compile with 0.8.x
- [ ] Deploy to BSC Testnet (Chain ID 97)
- [ ] Copy deployed contract address
- [ ] Add to `.env.local` as `NEXT_PUBLIC_TEST_TOKEN_ADDRESS`
- [ ] Add `<MintTestTokens />` to swap page
- [ ] Test minting
- [ ] Done! ✅

---

## 💡 **ALTERNATIVELY: Use Chainstack API**

If you prefer using a faucet API:

**Option A: Sign up for Chainstack**
1. Go to: https://console.chainstack.com
2. Create free account
3. Get API key
4. I'll integrate it for you

**But honestly, deploying your own token is easier and better!**

---

## 🚀 **WHAT DO YOU PREFER?**

**Option 1**: Deploy your own test token (RECOMMENDED)
- Takes 5 minutes one-time setup
- Users get unlimited tokens forever
- No API keys, no rate limits

**Option 2**: Integrate Chainstack API
- Requires you to sign up and get API key
- Has rate limits (0.5 BNB per 24h)
- Requires users to have mainnet ETH

**Which option do you want?** I can help with either! 🚀

**Meanwhile, your server is running - try refreshing the page to see if the phosphor-icons errors are gone!**
