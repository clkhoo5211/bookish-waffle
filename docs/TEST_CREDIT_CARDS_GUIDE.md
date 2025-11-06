# 💳 Test Credit Cards for On-Ramp Testing

**Created**: 2025-11-06  
**Purpose**: Complete guide for testing on-ramp purchases with test credit cards  
**Status**: ✅ Ready for Testnet Testing

---

## 🎯 **OVERVIEW**

This guide provides test credit card numbers for simulating on-ramp purchases on BSC Testnet. **NO real money will be charged.**

---

## 💳 **STRIPE TEST CARDS (Most Common)**

Reown/WalletConnect on-ramp providers typically use Stripe in the backend.

### **✅ SUCCESS CARDS**

```
Card Number: 4242 4242 4242 4242
Card Brand: Visa
Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
Result: ✅ Payment succeeds
```

```
Card Number: 5555 5555 5555 4444
Card Brand: Mastercard
Expiry: Any future date (e.g., 01/30)
CVC: Any 3 digits (e.g., 456)
ZIP: Any 5 digits (e.g., 90210)
Result: ✅ Payment succeeds
```

```
Card Number: 3782 822463 10005
Card Brand: American Express
Expiry: Any future date (e.g., 06/28)
CVC: Any 4 digits (e.g., 1234)
ZIP: Any 5 digits (e.g., 10001)
Result: ✅ Payment succeeds
```

```
Card Number: 6011 1111 1111 1117
Card Brand: Discover
Expiry: Any future date (e.g., 03/27)
CVC: Any 3 digits (e.g., 789)
ZIP: Any 5 digits (e.g., 33101)
Result: ✅ Payment succeeds
```

### **❌ FAILURE CARDS (For Error Testing)**

```
Card Number: 4000 0000 0000 0002
Reason: Card Declined
Use For: Testing decline handling
Result: ❌ Payment declined
```

```
Card Number: 4000 0000 0000 9995
Reason: Insufficient Funds
Use For: Testing insufficient balance errors
Result: ❌ Insufficient funds error
```

```
Card Number: 4000 0000 0000 0069
Reason: Expired Card
Use For: Testing expired card handling
Result: ❌ Card expired error
```

```
Card Number: 4000 0000 0000 0127
Reason: Incorrect CVC
Use For: Testing CVC validation
Result: ❌ Incorrect CVC error
```

```
Card Number: 4000 0000 0000 0119
Reason: Processing Error
Use For: Testing general processing errors
Result: ❌ Generic decline
```

### **🔄 SPECIAL TEST CARDS**

```
Card Number: 4000 0025 0000 3155
Feature: 3D Secure Authentication Required
Use For: Testing 3D Secure flow
Result: ✅ Requires authentication, then succeeds
```

```
Card Number: 4000 0000 0000 9979
Feature: Disputed Payment
Use For: Testing chargebacks/disputes
Result: ✅ Succeeds, but can be disputed
```

---

## 💳 **MOONPAY TEST CARDS**

If your on-ramp uses Moonpay:

### **Success Cards:**

```
Card Number: 4000 0566 5566 5556
Card Brand: Visa
Expiry: 12/25
CVC: 123
Name: Test User
Result: ✅ Payment succeeds
```

```
Card Number: 5436 0310 3060 6378
Card Brand: Mastercard
Expiry: 12/25
CVC: 123
Name: Test User
Result: ✅ Payment succeeds
```

### **Testing Specific Scenarios:**

```
Email: success@moonpay.com
Result: ✅ Always succeeds
```

```
Email: failed@moonpay.com
Result: ❌ Always fails
```

```
Email: pending@moonpay.com
Result: ⏳ Transaction stays pending
```

---

## 💳 **TRANSAK TEST CARDS**

If your on-ramp uses Transak:

### **Success Cards:**

```
Card Number: 4111 1111 1111 1111
Card Brand: Visa
Expiry: Any future date
CVC: 123
Result: ✅ Payment succeeds
```

```
Card Number: 5500 0000 0000 0004
Card Brand: Mastercard
Expiry: Any future date
CVC: 123
Result: ✅ Payment succeeds
```

### **Test Environment Setup:**

```
Email: test@transak.com
Phone: +1-555-123-4567
Amount: Any amount up to $500
Result: ✅ Succeeds in sandbox mode
```

---

## 🧪 **HOW TO TEST ON-RAMP**

### **Step 1: Ensure Testnet Environment**

```typescript
// Verify you're on BSC Testnet
Chain ID: 97 (NOT 56)
Network: BSC Testnet
```

### **Step 2: Open On-Ramp Modal**

```typescript
// In your application
- Click "Buy with Card" button
- Or click "Insufficient Balance → Buy Tokens"
- Reown on-ramp modal opens
```

### **Step 3: Enter Test Card Details**

```
Card Number: 4242 4242 4242 4242
Expiry: 12/25
CVC: 123
Name: Test User
ZIP: 12345
Email: test@example.com
Phone: +1-555-123-4567
```

### **Step 4: Select Token and Amount**

```
Token: BNB, USDC, or USDT
Amount: Any amount (e.g., $10, $50, $100)
Network: BSC Testnet (should be auto-selected)
```

### **Step 5: Complete Purchase**

```
- Click "Pay" or "Complete Purchase"
- Transaction processes (usually instant in test mode)
- Test tokens appear in your Smart Account
- NO real money charged!
```

---

## ⚠️ **IMPORTANT SAFETY NOTES**

### **🔒 Test Mode Protections:**

1. **Network Check**: Test cards only work on testnet (Chain ID 97)
2. **API Mode**: On-ramp providers automatically use test/sandbox mode on testnet
3. **No Real Charges**: Test cards cannot charge real money even if you try
4. **Failure Prevention**: Using real cards on testnet will fail (protection)

### **🚨 What Happens if You Accidentally Use Mainnet:**

```
Scenario: Testnet card + Mainnet network
Result: ❌ Transaction fails
Reason: Test cards don't work on mainnet
Protection: Prevents accidental real charges
```

```
Scenario: Real card + Testnet network
Result: ❌ Transaction fails
Reason: Real cards blocked on testnet
Protection: Prevents wasting real money on test tokens
```

### **✅ Only This Works:**

```
✅ Test card + Testnet = Simulated success (FREE)
✅ Real card + Mainnet = Real purchase (costs real money)
```

---

## 📋 **TESTING CHECKLIST**

### **Basic Flow Testing:**

- [ ] Connect wallet to BSC Testnet (Chain ID 97)
- [ ] Open on-ramp modal
- [ ] Enter test card: `4242 4242 4242 4242`
- [ ] Select BNB, amount $10
- [ ] Complete purchase
- [ ] Verify tokens received in Smart Account
- [ ] Check transaction history

### **Error Scenario Testing:**

- [ ] Test declined card: `4000 0000 0000 0002`
- [ ] Test insufficient funds: `4000 0000 0000 9995`
- [ ] Test expired card: `4000 0000 0000 0069`
- [ ] Test incorrect CVC: `4000 0000 0000 0127`
- [ ] Verify error messages display correctly

### **Token Variety Testing:**

- [ ] Purchase BNB with test card
- [ ] Purchase USDC with test card
- [ ] Purchase USDT with test card
- [ ] Verify all tokens appear in wallet

### **Amount Testing:**

- [ ] Small purchase: $5
- [ ] Medium purchase: $50
- [ ] Large purchase: $500
- [ ] Verify amounts match expectations

---

## 🔧 **TROUBLESHOOTING**

### **Problem: Test card not accepted**

**Causes:**
- Not on BSC Testnet (check Chain ID = 97)
- On-ramp not in test mode
- Wrong card format (check spaces, dashes)

**Solutions:**
1. Switch to BSC Testnet
2. Verify network in wallet
3. Try different test card
4. Check Reown dashboard settings

### **Problem: Purchase button disabled**

**Causes:**
- Wallet not connected
- Wrong network
- Amount too low/high
- Missing required fields

**Solutions:**
1. Connect wallet first
2. Switch to BSC Testnet
3. Enter valid amount ($10-500)
4. Fill all form fields

### **Problem: Transaction stuck pending**

**Causes:**
- Network congestion
- Provider API issue
- Browser extension conflict

**Solutions:**
1. Wait 30 seconds
2. Refresh page
3. Try again with new transaction
4. Check browser console for errors

---

## 📚 **QUICK REFERENCE**

### **Most Common Test Card:**

```
4242 4242 4242 4242
12/25 | 123 | 12345
```

### **Testing Different Scenarios:**

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
No Funds: 4000 0000 0000 9995
Expired: 4000 0000 0000 0069
```

### **Valid Card Details (Any of these work):**

```
Expiry: 12/25, 01/30, 06/28, 03/27
CVC: 123, 456, 789, 321
ZIP: 12345, 90210, 10001, 33101
Name: Test User, John Doe, Jane Smith
```

---

## 🎯 **RECOMMENDED TEST FLOW**

### **Day 1: Basic Success Testing**

```
1. Test card: 4242 4242 4242 4242
2. Amount: $10
3. Token: BNB
4. Expected: ✅ Success
5. Verify: Tokens in wallet
```

### **Day 2: Error Handling Testing**

```
1. Test all decline cards
2. Verify error messages
3. Check retry flows
4. Confirm user guidance
```

### **Day 3: Integration Testing**

```
1. Test full user journey:
   - Social login
   - Check balance
   - Insufficient balance detected
   - Buy with card
   - Transfer to contract
   - Complete transaction
```

---

## ✅ **SUCCESS INDICATORS**

Your on-ramp testing is successful when:

- ✅ Test cards work on BSC Testnet
- ✅ Tokens appear in Smart Account
- ✅ Error cards show proper error messages
- ✅ Transaction history updates correctly
- ✅ Balance updates immediately
- ✅ NO real money charged
- ✅ User experience is smooth
- ✅ All token types work (BNB, USDC, USDT)

---

## 🚀 **NEXT STEPS**

1. **Start Testing**: Use test cards on BSC Testnet
2. **Test All Scenarios**: Success, decline, errors
3. **Verify UX**: Check error messages, loading states
4. **Document Issues**: Note any bugs or improvements
5. **Move to Mainnet**: Once testing is complete

---

## 📞 **SUPPORT**

### **If Test Cards Don't Work:**

1. Check network: Must be BSC Testnet (Chain ID 97)
2. Check on-ramp provider settings
3. Verify test mode enabled in Reown dashboard
4. Contact Reown support with testnet environment info

### **Resources:**

- Stripe Test Cards: https://stripe.com/docs/testing
- Reown Documentation: https://docs.reown.com
- BSC Testnet: https://testnet.bscscan.com

---

**Status**: ✅ Ready for testing  
**Cost**: $0 (all testing is free)  
**Safety**: 100% safe (no real charges possible)

