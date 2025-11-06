# 🚀 QUICK START: Deploy Test Token (5 Minutes)

**You DON'T have 0.08 ETH on Ethereum mainnet, so this is your best option!**

---

## ⚡ **SUPER SIMPLE STEPS**

### **Step 1: Get 0.01 Test BNB (One-Time)**

**Try this faucet (no requirements):**
```
https://testnet.help/en/bscfaucet/testnet

1. Paste your address: 0x8dB1...F482
2. Solve reCAPTCHA
3. Get 0.01 test BNB (FREE)
```

**If that doesn't work, try:**
```
https://www.bnbchain.org/en/testnet-faucet
```

**Still stuck? Ask in Discord:**
```
https://discord.gg/bnbchain
Say: "Need 0.01 test BNB on BSC Testnet for testing"
Share your address: 0x8dB1...F482
```

---

### **Step 2: Deploy Contract (2 minutes)**

**Open Remix IDE:**
```
https://remix.ethereum.org
```

**Follow these exact steps:**

1. **Create File**:
   - Click "📄" icon (File Explorer)
   - Click "+" to create new file
   - Name it: `TestToken.sol`

2. **Paste Code**:
   - Copy the code from `contracts/TestToken.sol` in your project
   - Or I'll give you a shortened version:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TestUSDT {
    string public name = "Test USDT";
    string public symbol = "tUSDT";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    // Anyone can mint (testnet only!)
    function mint(address to, uint256 amount) external {
        totalSupply += amount;
        balanceOf[to] += amount;
        emit Transfer(address(0), to, amount);
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
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
}
```

3. **Compile**:
   - Click "🔨 Solidity Compiler" tab (left)
   - Select version: `0.8.20` or higher
   - Click "Compile TestToken.sol"
   - Should see ✅ green checkmark

4. **Deploy**:
   - Click "🚀 Deploy & Run" tab (left)
   - Environment: Select "Injected Provider - MetaMask"
   - **IMPORTANT**: In MetaMask, switch to **BSC Testnet**
   - Contract: Select "TestUSDT"
   - Click orange "Deploy" button
   - MetaMask popup appears
   - Click "Confirm" (costs ~$0.001 in test BNB)
   - Wait 10 seconds

5. **Copy Address**:
   - After deployment, see "Deployed Contracts" section
   - Click 📋 icon next to your contract
   - Address copied! (something like `0xABC123...`)

---

### **Step 3: Update Your App (30 seconds)**

**Add contract address:**

```bash
# Create or edit .env.local file
NEXT_PUBLIC_TEST_TOKEN_ADDRESS=0xYourContractAddressHere
```

Example:
```bash
NEXT_PUBLIC_TEST_TOKEN_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
```

**Restart your dev server:**
```bash
# Stop server (Ctrl+C in terminal)
# Then:
npm run dev
```

---

### **Step 4: Test It! (30 seconds)**

**In your app:**
1. Go to swap page
2. You should see new section: "🪙 Mint Test Tokens"
3. Enter amount: 1000
4. Click "Mint 1000 Test Tokens"
5. Confirm in MetaMask
6. Get tokens instantly!
7. Balance updates
8. Swap now works!

---

## 🎉 **DONE!**

Now your users can:
- ✅ Get **unlimited test tokens** anytime
- ✅ **No waiting** (instant minting)
- ✅ **No verification** needed
- ✅ **No rate limits**
- ✅ Works **every time**

**Total time**: 5 minutes  
**Total cost**: $0.001 in test BNB (one-time)  
**Result**: Unlimited test tokens forever!

---

## 🆘 **NEED HELP?**

**If you get stuck:**
1. Share screenshot
2. Tell me which step
3. I'll help you through it

**Or I can walk you through it step-by-step right now!**

---

**Ready to deploy? Just say "let's deploy" and I'll guide you through each step!** 🚀
