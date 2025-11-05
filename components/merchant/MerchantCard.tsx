'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Merchant } from '@/types/merchant';
import { formatDistance } from '@/lib/utils/distance';

interface MerchantCardProps {
  merchant: Merchant;
  onNavigate?: (merchant: Merchant) => void;
}

export const MerchantCard: React.FC<MerchantCardProps> = ({ merchant, onNavigate }) => {
  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate(merchant);
    } else {
      // Open in maps
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${merchant.address.lat},${merchant.address.lng}`;
      window.open(mapsUrl, '_blank');
    }
  };

  return (
    <Card className="bg-white overflow-hidden p-0">
      {/* Merchant Photo */}
      <div className="aspect-video bg-gradient-to-br from-[#f1f5f9] to-gray-200 flex items-center justify-center relative">
        <span className="text-6xl">{merchant.logo}</span>
        {merchant.photo && (
          <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            {merchant.about}
          </div>
        )}
      </div>

      {/* Merchant Details */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-[#1e293c] mb-3">
          {merchant.name}
        </h3>

        {/* Location */}
        <div className="flex items-start gap-2 mb-3">
          <span className="text-red-600 text-lg mt-0.5">📍</span>
          <p className="text-sm text-gray-600 flex-1">
            <strong>Location:</strong> {merchant.address.street}, {merchant.address.city}, 
            {merchant.address.postcode} {merchant.address.city}, {merchant.address.state}
          </p>
        </div>

        {/* Rebates */}
        <div className="flex gap-2 mb-3">
          <div className="flex items-center gap-1 bg-[#f3ba2f]/10 px-3 py-1.5 rounded-full">
            <span className="text-[#f3ba2f]">💎</span>
            <span className="text-sm font-semibold text-[#1e293c]">
              {merchant.bnbRebate}% BNB Rebates
            </span>
          </div>
          <div className="flex items-center gap-1 bg-[#00a19c]/10 px-3 py-1.5 rounded-full">
            <span className="text-[#00a19c]">🎁</span>
            <span className="text-sm font-semibold text-[#1e293c]">
              {merchant.tokenRebate}% Token Rebates
            </span>
          </div>
        </div>

        {/* Distance & Navigate */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-sm text-gray-600">
            {merchant.distance !== undefined ? formatDistance(merchant.distance) : 'Distance unknown'}
          </span>
          <Button 
            variant="primary" 
            size="sm"
            onClick={handleNavigate}
            className="!px-4"
          >
            <span className="mr-2">✈️</span>
            Navigates
          </Button>
        </div>
      </div>
    </Card>
  );
};

