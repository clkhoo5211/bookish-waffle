import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CookieConsent } from '@/components/compliance/CookieConsent';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

describe('CookieConsent Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null);
    localStorageMock.setItem.mockClear();
  });

  it('renders cookie consent banner', () => {
    const handleAccept = jest.fn();
    const handleReject = jest.fn();
    const handleCustomize = jest.fn();

    render(
      <CookieConsent
        onAccept={handleAccept}
        onReject={handleReject}
        onCustomize={handleCustomize}
      />
    );

    expect(screen.getByText(/Cookie Consent/i)).toBeInTheDocument();
  });

  it('calls onAccept when Accept All is clicked', () => {
    const handleAccept = jest.fn();
    const handleReject = jest.fn();
    const handleCustomize = jest.fn();

    render(
      <CookieConsent
        onAccept={handleAccept}
        onReject={handleReject}
        onCustomize={handleCustomize}
      />
    );

    const acceptButton = screen.getByText(/Accept All/i);
    fireEvent.click(acceptButton);
    expect(handleAccept).toHaveBeenCalledTimes(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('cookie-consent', 'accepted');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('analytics-consent', 'true');
  });

  it('calls onReject when Reject Optional is clicked', () => {
    const handleAccept = jest.fn();
    const handleReject = jest.fn();
    const handleCustomize = jest.fn();

    render(
      <CookieConsent
        onAccept={handleAccept}
        onReject={handleReject}
        onCustomize={handleCustomize}
      />
    );

    const rejectButton = screen.getByText(/Reject Optional/i);
    fireEvent.click(rejectButton);
    expect(handleReject).toHaveBeenCalledTimes(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith('cookie-consent', 'rejected');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('analytics-consent', 'false');
  });

  it('calls onCustomize when Customize is clicked', () => {
    const handleAccept = jest.fn();
    const handleReject = jest.fn();
    const handleCustomize = jest.fn();

    render(
      <CookieConsent
        onAccept={handleAccept}
        onReject={handleReject}
        onCustomize={handleCustomize}
      />
    );

    const customizeButton = screen.getByText(/Customize/i);
    fireEvent.click(customizeButton);
    expect(handleCustomize).toHaveBeenCalledTimes(1);
  });
});

