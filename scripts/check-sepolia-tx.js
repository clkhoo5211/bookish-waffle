/**
 * Check Sepolia Transaction Details
 * Get token address and balance from transaction hash
 */

const { createPublicClient, http } = require('viem');
const { sepolia } = require('viem/chains');

const TX_HASH = '0x090722a72bbd4f3ff89d346519242c5f8e3a89ac523e1ef1229528a275dc4c23';
const YOUR_ADDRESS = '0x8dB11c66a5FD00B10253696894805A03397AF482';

async function checkTransaction() {
  // Create Sepolia client
  const client = createPublicClient({
    chain: sepolia,
    transport: http('https://eth-sepolia.g.alchemy.com/v2/demo'),
  });

  console.log('🔍 Checking Sepolia transaction...\n');
  console.log('TX Hash:', TX_HASH);
  console.log('Your Address:', YOUR_ADDRESS);
  console.log('---\n');

  try {
    // Get transaction receipt
    const receipt = await client.getTransactionReceipt({
      hash: TX_HASH,
    });

    console.log('✅ Transaction found!\n');
    console.log('Status:', receipt.status === 'success' ? '✅ Success' : '❌ Failed');
    console.log('Block:', receipt.blockNumber);
    console.log('---\n');

    // Parse logs to find token transfers
    console.log('📋 Token Transfers:\n');

    // ERC20 Transfer event signature
    const TRANSFER_EVENT = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

    receipt.logs.forEach((log, index) => {
      if (log.topics[0] === TRANSFER_EVENT) {
        const tokenAddress = log.address;
        const from = '0x' + log.topics[1].slice(26);
        const to = '0x' + log.topics[2].slice(26);
        const amount = BigInt(log.data);

        console.log(`Transfer #${index + 1}:`);
        console.log(`  Token Address: ${tokenAddress}`);
        console.log(`  From: ${from}`);
        console.log(`  To: ${to}`);
        console.log(`  Amount (raw): ${amount.toString()}`);
        console.log(`  Amount (formatted): ${(Number(amount) / 1e18).toFixed(2)} tokens`);
        console.log('');
      }
    });

    // Get current balance
    console.log('💰 Checking your current balance...\n');

    // Find token addresses from logs
    const tokenAddresses = receipt.logs
      .filter(log => log.topics[0] === TRANSFER_EVENT)
      .map(log => log.address);

    for (const tokenAddress of [...new Set(tokenAddresses)]) {
      try {
        const balance = await client.readContract({
          address: tokenAddress,
          abi: [{
            name: 'balanceOf',
            type: 'function',
            stateMutability: 'view',
            inputs: [{ name: 'account', type: 'address' }],
            outputs: [{ type: 'uint256' }],
          }],
          functionName: 'balanceOf',
          args: [YOUR_ADDRESS],
        });

        const symbol = await client.readContract({
          address: tokenAddress,
          abi: [{
            name: 'symbol',
            type: 'function',
            stateMutability: 'view',
            inputs: [],
            outputs: [{ type: 'string' }],
          }],
          functionName: 'symbol',
        });

        console.log(`Token: ${symbol}`);
        console.log(`Address: ${tokenAddress}`);
        console.log(`Your Balance: ${(Number(balance) / 1e18).toFixed(2)} ${symbol}`);
        console.log('---\n');
      } catch (e) {
        console.log(`Token: ${tokenAddress}`);
        console.log('(Could not fetch details)');
        console.log('---\n');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTransaction();

