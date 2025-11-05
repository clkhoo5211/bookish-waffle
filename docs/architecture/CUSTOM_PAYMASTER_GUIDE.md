# Custom Paymaster Implementation Guide
## Build Your Own ERC-4337 Paymaster on BSC

**Project**: RVMplus Dapps  
**Created**: 2025-11-05  
**Complexity**: Advanced  
**Timeline**: 2-4 weeks additional development

---

## 📋 Overview

This guide explains how to create and deploy your own **Paymaster contract** for sponsoring user gas fees on BSC, instead of using Pimlico's paymaster service.

### Why Build Your Own Paymaster?

**Advantages**:
- ✅ **Full control** over sponsorship logic
- ✅ **No recurring API fees** - Only pay actual gas costs
- ✅ **Custom policies** - Your business rules
- ✅ **Data ownership** - All transactions on-chain
- ✅ **White-label** - Your brand, your infrastructure

**Disadvantages**:
- ❌ **More complex** - Need smart contract development
- ❌ **Maintenance required** - Upgrades, monitoring, funding
- ❌ **Security risk** - Must audit carefully
- ❌ **Longer timeline** - 2-4 weeks additional dev

---

## 🏗️ Architecture

### Paymaster Contract Types

There are several types of paymasters you can build:

#### 1. **Verifying Paymaster** (Recommended for You)
- Platform verifies and signs approval off-chain
- Contract verifies signature on-chain
- Prevents abuse via signature validation
- Most flexible for custom logic

#### 2. **Deposit Paymaster**
- Users deposit funds into paymaster
- Paymaster sponsors gas from user's deposit
- Simple but requires user deposits

#### 3. **ERC-20 Paymaster**
- Users pay gas fees in ERC-20 tokens (not BNB)
- Paymaster swaps tokens for BNB
- Good for token-only ecosystems

#### 4. **Allowlist Paymaster**
- Only whitelisted addresses get sponsorship
- Simple access control
- Limited flexibility

### Recommended: Verifying Paymaster

For RVMplus, I recommend the **Verifying Paymaster** because:
- ✅ You control who gets gasless transactions (via API signatures)
- ✅ Can implement rate limiting off-chain
- ✅ Can verify user quotas, balances, membership status
- ✅ Most flexible for evolving business logic

---

## 💻 Implementation

### Step 1: Paymaster Smart Contract

**File**: `contracts/RVMPaymaster.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@account-abstraction/contracts/core/BasePaymaster.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title RVMPaymaster
 * @notice Verifying Paymaster for RVMplus platform
 * @dev Sponsors gas fees for verified users on BSC
 */
contract RVMPaymaster is BasePaymaster, Ownable {
    using ECDSA for bytes32;

    // Mapping of used signatures to prevent replay attacks
    mapping(bytes32 => bool) public usedSignatures;
    
    // Signer address (your backend server)
    address public verifyingSigner;
    
    // Maximum gas cost we'll sponsor per UserOp
    uint256 public maxGasCostPerUserOp;
    
    // Events
    event SignerChanged(address indexed oldSigner, address indexed newSigner);
    event MaxGasCostChanged(uint256 oldMax, uint256 newMax);
    event UserOperationSponsored(address indexed user, uint256 actualGasCost);
    
    constructor(
        IEntryPoint _entryPoint,
        address _verifyingSigner,
        uint256 _maxGasCostPerUserOp
    ) BasePaymaster(_entryPoint) {
        verifyingSigner = _verifyingSigner;
        maxGasCostPerUserOp = _maxGasCostPerUserOp;
    }

    /**
     * @notice Validate UserOperation and sponsorship
     * @dev Called by EntryPoint before execution
     */
    function _validatePaymasterUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost
    ) internal override returns (bytes memory context, uint256 validationData) {
        // Decode signature from paymasterAndData
        (uint48 validUntil, uint48 validAfter, bytes memory signature) = 
            abi.decode(userOp.paymasterAndData[20:], (uint48, uint48, bytes));

        // Check if signature was already used (prevent replay)
        bytes32 signatureHash = keccak256(signature);
        require(!usedSignatures[signatureHash], "Signature already used");
        
        // Check max gas cost
        require(maxCost <= maxGasCostPerUserOp, "Gas cost too high");

        // Verify signature
        bytes32 hash = keccak256(
            abi.encode(
                userOp.sender,
                userOp.nonce,
                keccak256(userOp.initCode),
                keccak256(userOp.callData),
                userOp.callGasLimit,
                userOp.verificationGasLimit,
                userOp.preVerificationGas,
                userOp.maxFeePerGas,
                userOp.maxPriorityFeePerGas,
                block.chainid,
                address(this),
                validUntil,
                validAfter
            )
        );

        address recovered = hash.toEthSignedMessageHash().recover(signature);
        require(recovered == verifyingSigner, "Invalid signature");

        // Mark signature as used
        usedSignatures[signatureHash] = true;

        // Pack validation data
        validationData = _packValidationData(false, validUntil, validAfter);
        
        // Return context for postOp
        context = abi.encode(userOp.sender, maxCost);
        
        return (context, validationData);
    }

    /**
     * @notice Post-operation hook
     * @dev Called after UserOperation execution to track actual cost
     */
    function _postOp(
        PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost
    ) internal override {
        (address user, ) = abi.decode(context, (address, uint256));
        emit UserOperationSponsored(user, actualGasCost);
    }

    /**
     * @notice Update the verifying signer
     * @param _newSigner New signer address
     */
    function setVerifyingSigner(address _newSigner) external onlyOwner {
        require(_newSigner != address(0), "Invalid signer");
        address oldSigner = verifyingSigner;
        verifyingSigner = _newSigner;
        emit SignerChanged(oldSigner, _newSigner);
    }

    /**
     * @notice Update max gas cost per UserOp
     * @param _newMaxGasCost New max gas cost
     */
    function setMaxGasCostPerUserOp(uint256 _newMaxGasCost) external onlyOwner {
        uint256 oldMax = maxGasCostPerUserOp;
        maxGasCostPerUserOp = _newMaxGasCost;
        emit MaxGasCostChanged(oldMax, _newMaxGasCost);
    }

    /**
     * @notice Withdraw funds from the paymaster
     * @param withdrawAddress Address to send funds to
     * @param amount Amount to withdraw
     */
    function withdrawTo(
        address payable withdrawAddress,
        uint256 amount
    ) external onlyOwner {
        entryPoint.withdrawTo(withdrawAddress, amount);
    }

    /**
     * @notice Add deposit to EntryPoint
     */
    function deposit() external payable {
        entryPoint.depositTo{value: msg.value}(address(this));
    }

    /**
     * @notice Get current deposit in EntryPoint
     */
    function getDeposit() external view returns (uint256) {
        return entryPoint.balanceOf(address(this));
    }
}
```

### Step 2: Deployment Script

**File**: `scripts/deploy-paymaster.ts`

```typescript
import { ethers } from 'hardhat';

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log('Deploying RVMPaymaster with account:', deployer.address);
  console.log('Account balance:', (await deployer.getBalance()).toString());

  // BSC EntryPoint address (standard ERC-4337)
  const ENTRYPOINT_ADDRESS = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
  
  // Your backend signer address (will sign approvals)
  const VERIFYING_SIGNER = process.env.PAYMASTER_SIGNER_ADDRESS!;
  
  // Max gas cost per UserOp: 500,000 gas * 5 gwei = 0.0025 BNB (~$1.50)
  const MAX_GAS_COST = ethers.utils.parseEther('0.0025');

  const RVMPaymaster = await ethers.getContractFactory('RVMPaymaster');
  const paymaster = await RVMPaymaster.deploy(
    ENTRYPOINT_ADDRESS,
    VERIFYING_SIGNER,
    MAX_GAS_COST
  );

  await paymaster.deployed();

  console.log('RVMPaymaster deployed to:', paymaster.address);
  console.log('Verifying signer:', VERIFYING_SIGNER);
  console.log('Max gas cost per UserOp:', MAX_GAS_COST.toString());

  // Initial deposit to paymaster (e.g., 1 BNB)
  const initialDeposit = ethers.utils.parseEther('1.0');
  console.log('\nDepositing initial funds:', initialDeposit.toString());
  
  const depositTx = await paymaster.deposit({ value: initialDeposit });
  await depositTx.wait();
  
  console.log('Deposit successful!');
  console.log('Paymaster balance:', (await paymaster.getDeposit()).toString());

  // Verify on BSCScan
  console.log('\nVerifying contract on BSCScan...');
  console.log('Run: npx hardhat verify --network bsc', paymaster.address, 
    ENTRYPOINT_ADDRESS, VERIFYING_SIGNER, MAX_GAS_COST.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Step 3: Backend Signing Service

**File**: `lib/paymaster/signing-service.ts`

```typescript
import { ethers } from 'ethers';
import type { UserOperation } from 'permissionless';

interface SponsorshipRequest {
  userOp: UserOperation;
  userAddress: string;
  chainId: number;
}

interface SponsorshipPolicy {
  // User-specific limits
  maxTxPerUserPerDay: number;
  maxGasPerTx: bigint;
  
  // Global limits
  maxTxPerDay: number;
  maxDailyBudget: bigint;
}

export class PaymasterSigningService {
  private signer: ethers.Wallet;
  private paymasterAddress: string;
  private policy: SponsorshipPolicy;
  
  // In-memory storage (use Redis/DB in production)
  private userTxCount: Map<string, { count: number; date: string }> = new Map();
  private dailyStats = { txCount: 0, gasSpent: BigInt(0), date: '' };

  constructor(
    signerPrivateKey: string,
    paymasterAddress: string,
    policy: SponsorshipPolicy
  ) {
    this.signer = new ethers.Wallet(signerPrivateKey);
    this.paymasterAddress = paymasterAddress;
    this.policy = policy;
  }

  /**
   * Evaluate if we should sponsor this UserOperation
   */
  async shouldSponsor(request: SponsorshipRequest): Promise<boolean> {
    const { userAddress, userOp } = request;

    // Check daily budget
    const today = new Date().toISOString().split('T')[0];
    if (this.dailyStats.date !== today) {
      // Reset daily stats
      this.dailyStats = { txCount: 0, gasSpent: BigInt(0), date: today };
    }

    if (this.dailyStats.txCount >= this.policy.maxTxPerDay) {
      console.log('Daily transaction limit reached');
      return false;
    }

    if (this.dailyStats.gasSpent >= this.policy.maxDailyBudget) {
      console.log('Daily budget limit reached');
      return false;
    }

    // Check per-user limits
    const userStats = this.userTxCount.get(userAddress);
    if (userStats && userStats.date === today) {
      if (userStats.count >= this.policy.maxTxPerUserPerDay) {
        console.log(`User ${userAddress} exceeded daily limit`);
        return false;
      }
    }

    // Check gas limit
    const estimatedGas = 
      BigInt(userOp.callGasLimit) + 
      BigInt(userOp.verificationGasLimit) + 
      BigInt(userOp.preVerificationGas);
    
    if (estimatedGas > this.policy.maxGasPerTx) {
      console.log('Gas limit exceeded');
      return false;
    }

    // Add custom logic here:
    // - Check if user has RVM tokens
    // - Check user membership tier
    // - Check specific function being called
    // - Check transaction value
    // etc.

    return true;
  }

  /**
   * Sign approval for UserOperation
   */
  async signUserOp(
    userOp: UserOperation,
    validUntil: number,
    validAfter: number
  ): Promise<string> {
    // Create hash of UserOperation data
    const hash = ethers.utils.solidityKeccak256(
      [
        'address',   // sender
        'uint256',   // nonce
        'bytes32',   // initCode hash
        'bytes32',   // callData hash
        'uint256',   // callGasLimit
        'uint256',   // verificationGasLimit
        'uint256',   // preVerificationGas
        'uint256',   // maxFeePerGas
        'uint256',   // maxPriorityFeePerGas
        'uint256',   // chainId
        'address',   // paymaster
        'uint48',    // validUntil
        'uint48',    // validAfter
      ],
      [
        userOp.sender,
        userOp.nonce,
        ethers.utils.keccak256(userOp.initCode || '0x'),
        ethers.utils.keccak256(userOp.callData),
        userOp.callGasLimit,
        userOp.verificationGasLimit,
        userOp.preVerificationGas,
        userOp.maxFeePerGas,
        userOp.maxPriorityFeePerGas,
        userOp.chainId || 56, // BSC mainnet
        this.paymasterAddress,
        validUntil,
        validAfter,
      ]
    );

    // Sign with ethers
    const signature = await this.signer.signMessage(
      ethers.utils.arrayify(hash)
    );

    return signature;
  }

  /**
   * Update statistics after sponsoring
   */
  updateStats(userAddress: string, gasUsed: bigint) {
    const today = new Date().toISOString().split('T')[0];
    
    // Update daily stats
    this.dailyStats.txCount++;
    this.dailyStats.gasSpent += gasUsed;

    // Update user stats
    const userStats = this.userTxCount.get(userAddress);
    if (!userStats || userStats.date !== today) {
      this.userTxCount.set(userAddress, { count: 1, date: today });
    } else {
      userStats.count++;
    }
  }
}

// Export singleton instance
export const paymasterService = new PaymasterSigningService(
  process.env.PAYMASTER_SIGNER_PRIVATE_KEY!,
  process.env.PAYMASTER_CONTRACT_ADDRESS!,
  {
    maxTxPerUserPerDay: 10,
    maxGasPerTx: BigInt(500000),
    maxTxPerDay: 10000,
    maxDailyBudget: BigInt(10) * BigInt(10**18), // 10 BNB per day
  }
);
```

### Step 4: API Endpoint for Sponsorship

**File**: `app/api/paymaster/sponsor/route.ts` (Next.js API route)

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { paymasterService } from '@/lib/paymaster/signing-service';
import { ethers } from 'ethers';

export async function POST(request: NextRequest) {
  try {
    const { userOp, userAddress, chainId } = await request.json();

    // Validate request
    if (!userOp || !userAddress || !chainId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if we should sponsor
    const shouldSponsor = await paymasterService.shouldSponsor({
      userOp,
      userAddress,
      chainId,
    });

    if (!shouldSponsor) {
      return NextResponse.json(
        { error: 'Sponsorship denied', sponsored: false },
        { status: 403 }
      );
    }

    // Set validity period (e.g., 5 minutes)
    const validUntil = Math.floor(Date.now() / 1000) + 300;
    const validAfter = Math.floor(Date.now() / 1000) - 60;

    // Sign approval
    const signature = await paymasterService.signUserOp(
      userOp,
      validUntil,
      validAfter
    );

    // Encode paymasterAndData
    const paymasterAndData = ethers.utils.concat([
      process.env.PAYMASTER_CONTRACT_ADDRESS!,
      ethers.utils.defaultAbiCoder.encode(
        ['uint48', 'uint48', 'bytes'],
        [validUntil, validAfter, signature]
      ),
    ]);

    return NextResponse.json({
      sponsored: true,
      paymasterAndData: ethers.utils.hexlify(paymasterAndData),
      validUntil,
      validAfter,
    });
  } catch (error) {
    console.error('Paymaster sponsorship error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### Step 5: Client Integration

**File**: `lib/web3/custom-paymaster-client.ts`

```typescript
import { http, createPublicClient } from 'viem';
import { bsc } from 'viem/chains';

export async function getSponsoredPaymasterData(
  userOp: any,
  userAddress: string
) {
  try {
    // Call your backend API
    const response = await fetch('/api/paymaster/sponsor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userOp,
        userAddress,
        chainId: bsc.id,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Sponsorship denied:', error);
      return null;
    }

    const data = await response.json();
    
    if (data.sponsored) {
      console.log('✅ Gas sponsored by RVM Paymaster');
      return data.paymasterAndData;
    }

    return null;
  } catch (error) {
    console.error('Error getting paymaster data:', error);
    return null;
  }
}
```

---

## 📊 Cost Comparison

### Pimlico Paymaster (Hosted)
```
Setup cost: $0
Monthly cost (1,000 users, 10 TX each):
  - 10,000 UserOps × $0.0001 = $10/month API fees
  - 10,000 TX × $0.003 gas = $30/month gas costs
  - Total: ~$40/month
```

### Your Own Paymaster (Self-Hosted)
```
Setup cost: 
  - Development: $5,000-10,000 (40-80 hours)
  - Audit: $3,000-8,000 (recommended)
  - Total: $8,000-18,000

Monthly cost (1,000 users, 10 TX each):
  - API fees: $0 (your own server)
  - 10,000 TX × $0.003 gas = $30/month gas costs
  - Server costs: ~$50/month
  - Total: ~$80/month

Break-even: ~2 years (if no audit) or never (if including audit)
```

### Recommendation

| User Scale | Recommendation |
|------------|----------------|
| < 5,000 users | Use Pimlico (cheaper, faster) |
| 5,000-50,000 users | Consider custom (more control) |
| > 50,000 users | Definitely custom (cost savings) |

---

## 🔐 Security Considerations

### Critical Security Practices

1. **Audit Your Contract**
   - ⚠️ MUST audit before mainnet deployment
   - Cost: $3,000-8,000
   - Use: OpenZeppelin, Certik, or Trail of Bits

2. **Rate Limiting**
   - Implement per-user daily limits
   - Global daily budget caps
   - Use Redis for distributed rate limiting

3. **Signature Validation**
   - Always verify signatures on-chain
   - Prevent replay attacks (used signatures mapping)
   - Use time-based validity windows

4. **Access Control**
   - Use Ownable or AccessControl for admin functions
   - Multisig for critical operations
   - Timelocks for parameter changes

5. **Monitoring**
   - Alert on unusual spending patterns
   - Track per-user usage
   - Monitor paymaster balance
   - Log all sponsorship decisions

---

## 📈 Monitoring & Maintenance

### Dashboard Metrics to Track

```typescript
// Example monitoring
interface PaymasterMetrics {
  // Financial
  currentBalance: bigint;
  dailyGasSpent: bigint;
  monthlyGasSpent: bigint;
  
  // Usage
  totalUserOps: number;
  uniqueUsers: number;
  avgGasPerUserOp: bigint;
  
  // Rate limiting
  rejectedRequests: number;
  rejectionReasons: Record<string, number>;
  
  // Performance
  avgSigningTime: number;
  failureRate: number;
}
```

### Automated Alerts

Set up alerts for:
- ⚠️ Balance drops below 1 BNB
- ⚠️ Daily budget exceeded
- ⚠️ Unusual spending spike (> 2× normal)
- ⚠️ Signature validation failures
- ⚠️ Contract paused or upgraded

---

## 🚀 Deployment Steps

### 1. Local Testing

```bash
# Install dependencies
npm install --save-dev hardhat @nomiclabs/hardhat-ethers

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to local network
npx hardhat node
npx hardhat run scripts/deploy-paymaster.ts --network localhost
```

### 2. BSC Testnet Deployment

```bash
# Deploy to BSC Testnet
npx hardhat run scripts/deploy-paymaster.ts --network bscTestnet

# Verify on BSCScan
npx hardhat verify --network bscTestnet <PAYMASTER_ADDRESS> \
  <ENTRYPOINT> <SIGNER> <MAX_GAS>

# Test with real UserOperations
npm run test:integration
```

### 3. Mainnet Deployment

```bash
# After thorough testing and audit:

# Deploy to BSC Mainnet
npx hardhat run scripts/deploy-paymaster.ts --network bsc

# Verify on BSCScan
npx hardhat verify --network bsc <PAYMASTER_ADDRESS> \
  <ENTRYPOINT> <SIGNER> <MAX_GAS>

# Fund with initial deposit (e.g., 10 BNB)
# Monitor closely for first 24 hours
```

---

## ✅ Checklist

### Before Going Live
- [ ] Smart contract fully tested
- [ ] Security audit completed
- [ ] Testnet deployment successful
- [ ] Integration tests passing
- [ ] Monitoring dashboard set up
- [ ] Alert system configured
- [ ] Backup signer configured
- [ ] Emergency pause mechanism tested
- [ ] Rate limiting tested under load
- [ ] Documentation complete
- [ ] Team trained on operations

---

## 🎯 Recommendation for RVMplus

### Start with Pimlico, Migrate Later

**Phase 1 (Months 1-6): Use Pimlico**
- ✅ Launch quickly (no custom contract needed)
- ✅ Learn user patterns and costs
- ✅ Focus on product, not infrastructure
- ✅ Low risk, proven solution

**Phase 2 (Months 6-12): Evaluate**
- Analyze costs at scale
- If spending > $500/month on Pimlico, consider custom
- If need custom logic (e.g., RVM token holders only), build custom

**Phase 3 (Year 2+): Custom Paymaster**
- Build and audit custom paymaster
- Gradually migrate users
- Keep Pimlico as backup
- Save costs at scale

### Hybrid Approach

You can also use BOTH:
- **Pimlico**: For general users (pay-per-use)
- **Custom**: For premium users / RVM token holders (full sponsorship)

This gives best of both worlds!

---

## 📚 Resources

### Smart Contract Development
- [ERC-4337 Specification](https://eips.ethereum.org/EIPS/eip-4337)
- [Account Abstraction Contracts](https://github.com/eth-infinitism/account-abstraction)
- [OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)

### Tools & Libraries
- [Hardhat](https://hardhat.org/) - Development environment
- [permissionless.js](https://github.com/pimlicolabs/permissionless.js) - TypeScript library
- [Foundry](https://github.com/foundry-rs/foundry) - Alternative to Hardhat

### Security
- [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [OpenZeppelin Security Audits](https://blog.openzeppelin.com/security-audits)

---

## 💬 Need Help?

If you decide to build your own paymaster:
1. Start with Pimlico's example contracts as reference
2. Use OpenZeppelin's base contracts (already audited)
3. Get a security audit before mainnet (non-negotiable!)
4. Start with conservative limits and gradually increase

**My recommendation: Start with Pimlico for now, build custom paymaster in 6-12 months if needed.**

---

**Document Status**: Complete Technical Guide  
**Complexity**: Advanced (Smart Contract Development Required)  
**Timeline**: 2-4 weeks development + 1-2 weeks audit  
**Cost**: $8,000-18,000 setup + $50-80/month operations

