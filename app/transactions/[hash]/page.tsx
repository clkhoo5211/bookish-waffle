'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTransactionStore } from '@/store';
import type { Transaction } from '@/types/transaction';

export default function TransactionStatusPage() {
  const params = useParams();
  const router = useRouter();
  const { isConnected } = useAccount();
  const { transactionHistory } = useTransactionStore();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const hash = (params?.hash as string) || '';

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    // Find transaction in history
    const found = transactionHistory.find((tx) => tx.hash === hash);
    if (found) {
      setTransaction(found);
    }
  }, [hash, transactionHistory, isConnected, router]);

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusLabel = (status: Transaction['status']) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmed';
      case 'failed':
        return 'Failed';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  if (!transaction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <h2 className="text-2xl font-semibold mb-4">Transaction Not Found</h2>
            <p className="text-gray-600 mb-6">
              The transaction you&apos;re looking for could not be found.
            </p>
            <Button variant="primary" onClick={() => router.push('/')}>
              Go Home
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            ← Back
          </Button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Transaction Details</h1>
        
        <Card>
          <div className="space-y-6">
            {/* Status */}
            <div className="text-center">
              <div className={`inline-block px-4 py-2 rounded-full ${getStatusColor(transaction.status)}`}>
                {getStatusLabel(transaction.status)}
              </div>
            </div>

            {/* Transaction Hash */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Hash
              </label>
              <div className="flex items-center gap-2">
                <code className="flex-1 font-mono text-sm bg-gray-50 p-3 rounded break-all">
                  {transaction.hash}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(transaction.hash)}
                  className="text-primary-600 hover:text-primary-700 text-sm px-3 py-2"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Type</span>
                <span className="font-medium capitalize">{transaction.type}</span>
              </div>

              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">From</span>
                <code className="font-mono text-sm">
                  {transaction.from.slice(0, 6)}...{transaction.from.slice(-4)}
                </code>
              </div>

              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">To</span>
                <code className="font-mono text-sm">
                  {transaction.to.slice(0, 6)}...{transaction.to.slice(-4)}
                </code>
              </div>

              <div className="flex justify-between py-3 border-b">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium">{transaction.value} {transaction.tokenAddress || 'ETH'}</span>
              </div>

              {transaction.blockNumber && (
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Block Number</span>
                  <span className="font-medium">{transaction.blockNumber}</span>
                </div>
              )}

              {transaction.confirmations !== undefined && (
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Confirmations</span>
                  <span className="font-medium">{transaction.confirmations}</span>
                </div>
              )}

              <div className="flex justify-between py-3">
                <span className="text-gray-600">Timestamp</span>
                <span className="font-medium">
                  {new Date(transaction.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4">
              <Button
                variant="primary"
                fullWidth
                onClick={() => router.push('/')}
              >
                Done
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

