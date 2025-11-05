'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function MerchantSettingsPage() {
  const [companyName, setCompanyName] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [about, setAbout] = useState('');
  const [currency, setCurrency] = useState('');
  const [purchasePlans, setPurchasePlans] = useState([
    { buy: 100, free: 10 },
  ]);

  const addPurchasePlan = () => {
    setPurchasePlans([...purchasePlans, { buy: 0, free: 0 }]);
  };

  const updatePurchasePlan = (index: number, field: 'buy' | 'free', value: number) => {
    const updated = [...purchasePlans];
    updated[index][field] = value;
    setPurchasePlans(updated);
  };

  const handleSave = () => {
    // TODO: Implement save logic
    console.log('Saving merchant settings:', { companyName, tokenName, about, currency, purchasePlans });
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <div className="container mx-auto px-4 py-6 max-w-lg sm:max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-[#1e293c]">
            Merchant Settings
          </h1>
        </div>

        {/* Branding Section */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#1e293c] mb-4">Branding</h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gray-100 text-center">
              <p className="text-sm text-gray-600 mb-2">Upload Logo</p>
              <p className="text-xs text-gray-500 mb-3">Square, 500x500px recommended</p>
              <Button variant="primary" size="sm">
                Upload
              </Button>
            </Card>
            <Card className="bg-gray-100 text-center">
              <p className="text-sm text-gray-600 mb-2">Upload Banner</p>
              <p className="text-xs text-gray-500 mb-3">Square, 1500x500px recommended</p>
              <Button variant="primary" size="sm">
                Upload
              </Button>
            </Card>
          </div>
        </div>

        {/* Live Preview */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#1e293c] mb-4">Live Preview</h2>
          <Card className="bg-white p-0 overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-[#f1f5f9] to-gray-200 flex items-center justify-center">
              <span className="text-6xl">🏪</span>
            </div>
            <div className="p-4">
              <h3 className="text-xl font-bold text-[#1e293c] mb-2">
                {companyName || 'Your Business Name'}
              </h3>
              <div className="flex items-start gap-2 mb-3">
                <span className="text-red-600 text-lg">📍</span>
                <p className="text-sm text-gray-600">
                  <strong>Location:</strong> Your business address will appear here
                </p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 bg-[#f3ba2f]/10 px-3 py-1.5 rounded-full">
                  <span className="text-[#f3ba2f]">💎</span>
                  <span className="text-sm font-semibold">20% BNB Rebates</span>
                </div>
                <div className="flex items-center gap-1 bg-[#00a19c]/10 px-3 py-1.5 rounded-full">
                  <span className="text-[#00a19c]">🎁</span>
                  <span className="text-sm font-semibold">10% Token Rebates</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Business Details */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#1e293c] mb-4">Business Details</h2>
          <Card className="bg-white space-y-4">
            <Input
              label="Company Name"
              placeholder="Enter your company name"
              value={companyName}
              onChange={setCompanyName}
            />
            <Input
              label="Token Name"
              placeholder="Enter your token's name"
              value={tokenName}
              onChange={setTokenName}
            />
            <div>
              <label className="block text-sm font-semibold text-[#1e293c] mb-2">
                About Your Company
              </label>
              <textarea
                placeholder="Enter some short description about your company"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a19c] bg-white text-[#1e293c]"
              />
            </div>
          </Card>
        </div>

        {/* Currency Settings */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#1e293c] mb-4">Currency Settings</h2>
          <Card className="bg-white">
            <label className="block text-sm font-semibold text-[#1e293c] mb-2">
              Currency Accept
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#00a19c]"
            >
              <option value="">Select Currency</option>
              <option value="BNB">BNB</option>
              <option value="USDT">USDT</option>
              <option value="USD1">USD1</option>
              <option value="Cake">Cake</option>
            </select>
          </Card>
        </div>

        {/* Token Purchase Plan */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#1e293c] mb-4">Token Purchase Plan</h2>
          <Card className="bg-white space-y-3">
            {purchasePlans.map((plan, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Buy amount"
                    type="number"
                    value={plan.buy.toString()}
                    onChange={(val) => updatePurchasePlan(index, 'buy', parseInt(val) || 0)}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    placeholder="Free amount"
                    type="number"
                    value={plan.free.toString()}
                    onChange={(val) => updatePurchasePlan(index, 'free', parseInt(val) || 0)}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              fullWidth
              onClick={addPurchasePlan}
              className="mt-3"
            >
              + Add More
            </Button>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={handleSave}
          >
            Save Changes
          </Button>
          <button
            onClick={() => window.history.back()}
            className="w-full text-center text-gray-600 py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

