import { 
  CONSENT_STORAGE_KEY, 
  CONSENT_VERSION, 
  DEFAULT_CONSENT,
  CONSENT_EVENT_NAME
} from "./consent-types";

// Safety wrapper around localStorage
function getStorage() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch (e) {
    return null; // Private browsing or quota exceeded
  }
}

export function getConsent() {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const stored = storage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    
    // Check version and shape
    if (
      !parsed || 
      parsed.version !== CONSENT_VERSION || 
      typeof parsed.necessary !== "boolean" ||
      typeof parsed.preferences !== "boolean" ||
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.advertising !== "boolean"
    ) {
      return null; // Invalid or outdated record
    }

    return parsed;
  } catch (e) {
    return null;
  }
}

export function saveConsent(consentData) {
  const storage = getStorage();
  const record = {
    ...DEFAULT_CONSENT,
    ...consentData,
    necessary: true, // Force true
    version: CONSENT_VERSION,
    updatedAt: new Date().toISOString(),
  };

  if (storage) {
    try {
      storage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    } catch (e) {
      // Storage failed (quota or privacy mode), silently fail but still dispatch event so UI works
      console.warn("Could not save consent preferences to localStorage.");
    }
  }

  // Dispatch event for other components and cross-tab sync
  if (typeof window !== "undefined") {
    const event = new CustomEvent(CONSENT_EVENT_NAME, { detail: record });
    window.dispatchEvent(event);
  }

  return record;
}

export function hasConsent() {
  return getConsent() !== null;
}

export function hasAnalyticsConsent() {
  const consent = getConsent();
  return consent ? consent.analytics === true : false;
}

export function hasAdvertisingConsent() {
  const consent = getConsent();
  return consent ? consent.advertising === true : false;
}

export function resetConsent() {
  const storage = getStorage();
  if (storage) {
    try {
      storage.removeItem(CONSENT_STORAGE_KEY);
    } catch (e) {
      // Ignore
    }
  }
  if (typeof window !== "undefined") {
    const event = new CustomEvent(CONSENT_EVENT_NAME, { detail: null });
    window.dispatchEvent(event);
  }
}
