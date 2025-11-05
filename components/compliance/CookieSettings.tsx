'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface CookieSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CookieSettings: React.FC<CookieSettingsProps> = ({
  isOpen,
  onClose,
}) => {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('analytics-consent');
    setAnalyticsEnabled(consent === 'true');
  }, []);

  const handleSave = () => {
    localStorage.setItem('analytics-consent', analyticsEnabled.toString());
    localStorage.setItem('cookie-consent', 'customized');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cookie Settings" size="lg">
      <div className="space-y-6">
        <div>
          <p className="text-gray-700 text-sm mb-4">
            Manage your cookie preferences. You can enable or disable optional cookies at any time.
          </p>
          <p className="text-gray-600 text-xs mb-4">
            <a
              href="/docs/compliance/cookie-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 underline hover:text-primary-700"
            >
              Learn more about our cookie usage
            </a>
          </p>
        </div>

        {/* Essential Cookies */}
        <div className="border-b pb-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Essential Cookies</h3>
              <p className="text-sm text-gray-600 mt-1">
                Required for the app to function properly. These cookies cannot be disabled.
              </p>
            </div>
            <div className="ml-4">
              <span className="text-sm text-gray-500">Always Active</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <p>• Session management</p>
            <p>• Wallet connection state</p>
            <p>• User preferences</p>
            <p>• App functionality</p>
          </div>
        </div>

        {/* Analytics Cookies */}
        <div className="border-b pb-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Analytics Cookies</h3>
              <p className="text-sm text-gray-600 mt-1">
                Help us understand how the app is used and improve performance. Data is anonymized.
              </p>
            </div>
            <div className="ml-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <p>• Usage analytics (anonymized)</p>
            <p>• Error tracking (anonymized)</p>
            <p>• Performance monitoring</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button variant="primary" onClick={handleSave} fullWidth>
            Save Preferences
          </Button>
          <Button variant="outline" onClick={onClose} fullWidth>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

