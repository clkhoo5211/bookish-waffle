'use client';

import { useEffect } from 'react';

export function AnalyticsSuppress() {
  useEffect(() => {
    const originalError = console.error;
    console.error = function(...args: any[]) {
      const message = args[0]?.toString() || '';
      if (message.includes('Analytics SDK') || message.includes('Failed to fetch')) {
        return; // Suppress analytics errors
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return null;
}

