"use client";

import React, { useState, useEffect } from "react";
import { hasConsent, getConsent } from "@/lib/consent/consent-storage";
import { useConsentListener, useOpenSettingsListener } from "@/lib/consent/consent-events";
import CookieConsentBanner from "./CookieConsentBanner";
import CookiePreferencesPanel from "./CookiePreferencesPanel";

export default function CookieConsentProvider({ children }) {
  const [isClient, setIsClient] = useState(false);
  const [needsConsent, setNeedsConsent] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentConsent, setCurrentConsent] = useState(null);

  useEffect(() => {
    setIsClient(true);
    // Check local storage on mount to prevent hydration mismatch
    const validConsent = hasConsent();
    setNeedsConsent(!validConsent);
    if (validConsent) {
      setCurrentConsent(getConsent());
    }
  }, []);

  // Sync state if it changes from another tab or within this tab
  useConsentListener((newConsent) => {
    if (newConsent) {
      setNeedsConsent(false);
      setCurrentConsent(newConsent);
    } else {
      setNeedsConsent(true);
      setCurrentConsent(null);
    }
  });

  // Reopen panel via footer event
  useOpenSettingsListener(() => {
    // Make sure we have the latest state before opening
    setCurrentConsent(getConsent());
    setSettingsOpen(true);
  });

  return (
    <>
      {children}
      {isClient && needsConsent && !settingsOpen && (
        <CookieConsentBanner 
          onResolved={() => {
            // The listener will automatically pick up the storage change
            // but we can also locally close it if needed, 
            // the listener handles it cleanly though.
          }} 
        />
      )}
      {isClient && (
        <CookiePreferencesPanel 
          isOpen={settingsOpen} 
          onClose={() => setSettingsOpen(false)}
          initialConsent={currentConsent}
        />
      )}
    </>
  );
}
