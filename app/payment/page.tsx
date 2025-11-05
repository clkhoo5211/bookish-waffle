'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { validateEthereumAddress, validateAmount } from '@/lib/utils/validation';
import { DEV_MODE, MOCK_WALLET } from '@/lib/dev/mock-mode';

export default function PaymentPage() {
  const wagmiAccount = useAccount();
  
  // Use mock data in dev mode, real data otherwise
  const { address, isConnected } = DEV_MODE 
    ? { address: MOCK_WALLET.address, isConnected: MOCK_WALLET.isConnected }
    : wagmiAccount;
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('ETH');
  const [recipientError, setRecipientError] = useState('');
  const [amountError, setAmountError] = useState('');

  const handleRecipientChange = (value: string) => {
    setRecipient(value);
    if (value) {
      const validation = validateEthereumAddress(value);
      if (!validation.isValid) {
        setRecipientError(validation.error || 'Invalid address');
      } else {
        setRecipientError('');
        // Use normalized address if validation passed
        if (validation.normalizedAddress) {
          setRecipient(validation.normalizedAddress);
        }
      }
    } else {
      setRecipientError('');
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (value) {
      const validation = validateAmount(value);
      if (!validation.isValid) {
        setAmountError(validation.error || 'Invalid amount');
      } else {
        setAmountError('');
      }
    } else {
      setAmountError('');
    }
  };

  const handlePayment = async () => {
    // Validate inputs before proceeding
    const recipientValidation = validateEthereumAddress(recipient);
    const amountValidation = validateAmount(amount);

    if (!recipientValidation.isValid) {
      setRecipientError(recipientValidation.error || 'Invalid address');
      return;
    }

    if (!amountValidation.isValid) {
      setAmountError(amountValidation.error || 'Invalid amount');
      return;
    }

    // Use normalized address if available
    const normalizedRecipient = recipientValidation.normalizedAddress || recipient;
    
    // Navigate to confirmation page with payment details
    const params = new URLSearchParams({
      to: normalizedRecipient,
      amount: amount,
      token: token,
    });
    window.location.href = `/payment/confirm-merchant?${params.toString()}`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#f1f5f9]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <h2 className="text-2xl font-semibold text-[#1e293c] mb-4">Connect Wallet</h2>
              <p className="text-gray-600">
                Please connect your wallet to make payments
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1e293c] mb-8">Make Payment</h1>
          
          <Card className="bg-white">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#1e293c] mb-2">
                  Your Wallet
                </label>
                <p className="text-gray-600 font-mono text-sm break-all bg-[#f1f5f9] p-3 rounded-lg">
                  {address}
                </p>
              </div>

              <div>
                <Input
                  label="Recipient Address"
                  placeholder="0x..."
                  value={recipient}
                  onChange={handleRecipientChange}
                  required
                  error={recipientError}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1e293c] mb-2">
                  Amount
                </label>
                <div className="flex gap-3">
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={amount}
                    onChange={handleAmountChange}
                    className="flex-1"
                    required
                    error={amountError}
                  />
                  <select
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="px-6 py-3 border border-gray-200 rounded-lg bg-white font-semibold text-[#1e293c] focus:outline-none focus:ring-2 focus:ring-[#00a19c]"
                  >
                    <option value="ETH">ETH</option>
                    <option value="USDT">USDT</option>
                    <option value="USDC">USDC</option>
                  </select>
                </div>
              </div>

              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handlePayment}
                disabled={!recipient || !amount || !!recipientError || !!amountError}
              >
                Send Payment
              </Button>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
}

