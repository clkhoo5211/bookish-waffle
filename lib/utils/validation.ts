/**
 * Validation utilities for security and input validation
 */

import { isAddress, getAddress } from 'viem';

/**
 * Validates an Ethereum address
 * @param address - The address to validate
 * @returns Object with validation result and normalized address
 */
export function validateEthereumAddress(address: string): {
  isValid: boolean;
  normalizedAddress?: string;
  error?: string;
} {
  if (!address || typeof address !== 'string') {
    return { isValid: false, error: 'Address is required' };
  }

  // Remove whitespace
  const trimmed = address.trim();

  // Check if it's a valid Ethereum address format
  if (!isAddress(trimmed)) {
    return { isValid: false, error: 'Invalid Ethereum address format' };
  }

  try {
    // Normalize to checksummed address
    const checksummed = getAddress(trimmed);
    return { isValid: true, normalizedAddress: checksummed };
  } catch (error) {
    return { isValid: false, error: 'Invalid address checksum' };
  }
}

/**
 * Validates a transaction amount
 * @param amount - The amount as a string
 * @param min - Minimum allowed amount (default: 0)
 * @param max - Maximum allowed amount (optional)
 * @returns Object with validation result
 */
export function validateAmount(
  amount: string,
  min: number = 0,
  max?: number
): {
  isValid: boolean;
  numericValue?: number;
  error?: string;
} {
  if (!amount || typeof amount !== 'string') {
    return { isValid: false, error: 'Amount is required' };
  }

  const trimmed = amount.trim();

  // Check if it's a valid number
  const numericValue = parseFloat(trimmed);
  if (isNaN(numericValue)) {
    return { isValid: false, error: 'Amount must be a valid number' };
  }

  // Check if it's positive
  if (numericValue <= 0) {
    return { isValid: false, error: 'Amount must be greater than zero' };
  }

  // Check minimum
  if (numericValue < min) {
    return { isValid: false, error: `Amount must be at least ${min}` };
  }

  // Check maximum if provided
  if (max !== undefined && numericValue > max) {
    return { isValid: false, error: `Amount must not exceed ${max}` };
  }

  return { isValid: true, numericValue };
}

/**
 * Validates a transaction hash
 * @param hash - The transaction hash to validate
 * @returns Object with validation result
 */
export function validateTransactionHash(hash: string): {
  isValid: boolean;
  error?: string;
} {
  if (!hash || typeof hash !== 'string') {
    return { isValid: false, error: 'Transaction hash is required' };
  }

  const trimmed = hash.trim();

  // Ethereum transaction hash format: 0x followed by 64 hex characters
  const txHashRegex = /^0x[a-fA-F0-9]{64}$/;
  if (!txHashRegex.test(trimmed)) {
    return { isValid: false, error: 'Invalid transaction hash format' };
  }

  return { isValid: true };
}

/**
 * Sanitizes user input to prevent XSS
 * @param input - The input string to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove potential XSS vectors
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

