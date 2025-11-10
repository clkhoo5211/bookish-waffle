/**
 * React Hook for Smart Account Backend Operations
 * Provides easy-to-use functions for managing smart accounts from the frontend
 */

import { useState, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { isAddress, formatUnits, parseUnits } from 'viem';

export interface SmartAccountData {
  eoaAddress: string;
  smartAccountAddress: string;
  isDeployed: boolean;
  chainId: number;
  createdAt: number;
  linkedAt: number;
}

export interface ConversionStatus {
  hasGas: boolean;
  hasUSDT: boolean;
  eoaUSDTBalance: string;
  smartAccountUSDTBalance: string;
  smartAccountETHBalance: string;
  needsGasFunding: boolean;
}

export interface WithdrawalStatus {
  hasGas: boolean;
  hasUSDT: boolean;
  smartAccountUSDTBalance: string;
  canWithdraw: boolean;
}

export function useSmartAccountBackend() {
  const { address: eoaAddress, isConnected } = useAccount();
  const chainId = useChainId();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Create or get smart account
   */
  const createSmartAccount = useCallback(async (): Promise<SmartAccountData | null> => {
    if (!isConnected || !eoaAddress) {
      setError('Wallet not connected');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/smart-account/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eoaAddress,
          chainId,
          userAgent: navigator.userAgent,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create smart account');
      }

      return data.smartAccount;
    } catch (err: any) {
      setError(err.message || 'Failed to create smart account');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isConnected, eoaAddress, chainId]);

  /**
   * Get existing smart account
   */
  const getSmartAccount = useCallback(async (): Promise<SmartAccountData | null> => {
    if (!isConnected || !eoaAddress) {
      setError('Wallet not connected');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/smart-account/create?eoaAddress=${eoaAddress}&chainId=${chainId}`
      );

      const data = await response.json();

      // Handle 404 as "not found" (not an error)
      if (!response.ok && response.status === 404) {
        if (data.error === 'Smart account not found') {
          return null;
        }
        throw new Error(data.error || 'Failed to get smart account');
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${data.error || 'Failed to get smart account'}`);
      }

      if (!data.success) {
        if (data.error === 'Smart account not found') {
          return null;
        }
        throw new Error(data.error || 'Failed to get smart account');
      }

      return data.smartAccount;
    } catch (err: any) {
      setError(err.message || 'Failed to get smart account');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isConnected, eoaAddress, chainId]);

  /**
   * Check conversion status
   */
  const checkConversionStatus = useCallback(async (): Promise<ConversionStatus | null> => {
    if (!isConnected || !eoaAddress) {
      setError('Wallet not connected');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/smart-account/convert?eoaAddress=${eoaAddress}&chainId=${chainId}`
      );

      const data = await response.json();

      // Handle 404 as "not found" (smart account doesn't exist yet)
      if (!response.ok && response.status === 404) {
        if (data.error && data.error.includes('Smart account not found')) {
          return null; // Smart account doesn't exist yet
        }
        throw new Error(data.error || 'Failed to check conversion status');
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${data.error || 'Failed to check conversion status'}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to check conversion status');
      }

      return data.status;
    } catch (err: any) {
      setError(err.message || 'Failed to check conversion status');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isConnected, eoaAddress, chainId]);

  /**
   * Prepare conversion transaction
   */
  const prepareConversion = useCallback(
    async (amount?: string): Promise<any | null> => {
      if (!isConnected || !eoaAddress) {
        setError('Wallet not connected');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/smart-account/convert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eoaAddress,
            chainId,
            amount,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to prepare conversion');
        }

        return data;
      } catch (err: any) {
        setError(err.message || 'Failed to prepare conversion');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isConnected, eoaAddress, chainId]
  );

  /**
   * Check withdrawal status
   */
  const checkWithdrawalStatus = useCallback(async (): Promise<WithdrawalStatus | null> => {
    if (!isConnected || !eoaAddress) {
      setError('Wallet not connected');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/smart-account/withdraw?eoaAddress=${eoaAddress}&chainId=${chainId}`
      );

      const data = await response.json();

      // Handle 404 as "not found" (smart account doesn't exist yet)
      if (!response.ok && response.status === 404) {
        if (data.error && data.error.includes('Smart account not found')) {
          return null; // Smart account doesn't exist yet
        }
        throw new Error(data.error || 'Failed to check withdrawal status');
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${data.error || 'Failed to check withdrawal status'}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to check withdrawal status');
      }

      return data.status;
    } catch (err: any) {
      setError(err.message || 'Failed to check withdrawal status');
      return null;
    } finally {
      setLoading(false);
    }
  }, [isConnected, eoaAddress, chainId]);

  /**
   * Prepare withdrawal transaction
   */
  const prepareWithdrawal = useCallback(
    async (amount?: string, withdrawAll: boolean = false): Promise<any | null> => {
      if (!isConnected || !eoaAddress) {
        setError('Wallet not connected');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/smart-account/withdraw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eoaAddress,
            chainId,
            amount,
            withdrawAll,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to prepare withdrawal');
        }

        return data;
      } catch (err: any) {
        setError(err.message || 'Failed to prepare withdrawal');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isConnected, eoaAddress, chainId]
  );

  return {
    loading,
    error,
    createSmartAccount,
    getSmartAccount,
    checkConversionStatus,
    prepareConversion,
    checkWithdrawalStatus,
    prepareWithdrawal,
  };
}

