/**
 * Storage Service
 * Handles persistence of smart account data
 * 
 * In production, replace this with a database (PostgreSQL, MongoDB, etc.)
 */

import type { SmartAccountInfo } from './smart-account-service';

// In-memory storage (replace with database in production)
const smartAccountMap = new Map<string, SmartAccountInfo>();

/**
 * Generate storage key from EOA address and chain ID
 */
function getStorageKey(eoaAddress: string, chainId: number): string {
  return `${eoaAddress.toLowerCase()}-${chainId}`;
}

/**
 * Store smart account info
 */
export async function storeSmartAccount(smartAccount: SmartAccountInfo): Promise<void> {
  const key = getStorageKey(smartAccount.eoaAddress, smartAccount.chainId);
  smartAccountMap.set(key, smartAccount);
  
  // In production, save to database:
  // await db.smartAccounts.upsert({
  //   where: { eoaAddress_chainId: { eoaAddress: smartAccount.eoaAddress, chainId: smartAccount.chainId } },
  //   update: smartAccount,
  //   create: smartAccount,
  // });
}

/**
 * Get smart account info by EOA address
 */
export async function getSmartAccount(
  eoaAddress: string,
  chainId: number
): Promise<SmartAccountInfo | null> {
  const key = getStorageKey(eoaAddress, chainId);
  const account = smartAccountMap.get(key) || null;
  
  // In production, fetch from database:
  // return await db.smartAccounts.findUnique({
  //   where: { eoaAddress_chainId: { eoaAddress, chainId } },
  // });
  
  return account;
}

/**
 * Update smart account info
 */
export async function updateSmartAccount(
  eoaAddress: string,
  chainId: number,
  updates: Partial<SmartAccountInfo>
): Promise<SmartAccountInfo | null> {
  const existing = await getSmartAccount(eoaAddress, chainId);
  
  if (!existing) {
    return null;
  }
  
  const updated = { ...existing, ...updates };
  await storeSmartAccount(updated);
  
  return updated;
}

/**
 * Get all smart accounts for a given EOA (across all chains)
 */
export async function getAllSmartAccounts(eoaAddress: string): Promise<SmartAccountInfo[]> {
  const accounts: SmartAccountInfo[] = [];
  
  for (const [key, account] of smartAccountMap.entries()) {
    if (key.toLowerCase().startsWith(eoaAddress.toLowerCase())) {
      accounts.push(account);
    }
  }
  
  // In production, fetch from database:
  // return await db.smartAccounts.findMany({
  //   where: { eoaAddress },
  // });
  
  return accounts;
}

/**
 * Delete smart account (for testing/cleanup)
 */
export async function deleteSmartAccount(eoaAddress: string, chainId: number): Promise<boolean> {
  const key = getStorageKey(eoaAddress, chainId);
  return smartAccountMap.delete(key);
  
  // In production, delete from database:
  // await db.smartAccounts.delete({
  //   where: { eoaAddress_chainId: { eoaAddress, chainId } },
  // });
}

