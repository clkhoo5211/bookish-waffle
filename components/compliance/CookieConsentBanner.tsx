'use client';

import React, { useState, useEffect } from 'react';
import { CookieConsent } from './CookieConsent';
import { CookieSettings } from './CookieSettings';

export const CookieConsentBanner: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);

  const handleAccept = () => {
    // Analytics consent accepted
    console.log('Analytics cookies accepted');
  };

  const handleReject = () => {
    // Analytics consent rejected
    console.log('Analytics cookies rejected');
  };

  const handleCustomize = () => {
    setShowSettings(true);
  };

  return (
    <>
      <CookieConsent
        onAccept={handleAccept}
        onReject={handleReject}
        onCustomize={handleCustomize}
      />
      <CookieSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
};

