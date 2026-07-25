import { useEffect } from "react";
import { CONSENT_EVENT_NAME, CONSENT_STORAGE_KEY } from "./consent-types";
import { getConsent } from "./consent-storage";

export function useConsentListener(callback) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Listen for our custom event (same tab)
    const handleCustomEvent = (event) => {
      callback(event.detail);
    };

    // Listen for storage event (cross tab sync)
    const handleStorageEvent = (event) => {
      if (event.key === CONSENT_STORAGE_KEY) {
        callback(getConsent());
      }
    };

    window.addEventListener(CONSENT_EVENT_NAME, handleCustomEvent);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener(CONSENT_EVENT_NAME, handleCustomEvent);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [callback]);
}

// Global control to reopen settings
export const OPEN_SETTINGS_EVENT = "snapfreetools:open-cookie-settings";

export function openCookieSettings() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT));
  }
}

export function useOpenSettingsListener(callback) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const handleOpen = () => callback();
    window.addEventListener(OPEN_SETTINGS_EVENT, handleOpen);
    
    return () => {
      window.removeEventListener(OPEN_SETTINGS_EVENT, handleOpen);
    };
  }, [callback]);
}
