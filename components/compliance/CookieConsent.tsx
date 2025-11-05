'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface CookieConsentProps {
  onAccept: () => void;
  onReject: () => void;
  onCustomize: () => void;
}

export const CookieConsent: React.FC<CookieConsentProps> = ({
  onAccept,
  onReject,
  onCustomize,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('analytics-consent', 'true');
    setIsVisible(false);
    onAccept();
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    localStorage.setItem('analytics-consent', 'false');
    setIsVisible(false);
    onReject();
  };

  const handleCustomize = () => {
    setIsVisible(false);
    onCustomize();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-black bg-opacity-50">
      <Card className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Cookie Consent
            </h2>
            <p className="text-gray-700 text-sm">
              We use cookies to enhance your experience, analyze app usage, and improve our services.
              Essential cookies are required for the app to function. Analytics cookies are optional
              and require your consent.
            </p>
            <p className="text-gray-600 text-xs mt-2">
              By clicking "Accept All", you consent to our use of cookies. You can customize your
              preferences or reject optional cookies at any time.{' '}
              <a
                href="/docs/compliance/cookie-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 underline hover:text-primary-700"
              >
                Learn more in our Cookie Policy
              </a>
              .
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              onClick={handleAccept}
              className="flex-1"
            >
              Accept All
            </Button>
            <Button
              variant="outline"
              onClick={handleReject}
              className="flex-1"
            >
              Reject Optional
            </Button>
            <Button
              variant="ghost"
              onClick={handleCustomize}
              className="flex-1"
            >
              Customize
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

