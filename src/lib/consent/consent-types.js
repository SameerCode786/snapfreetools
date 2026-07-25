export const CONSENT_STORAGE_KEY = "snapfreetools_cookie_consent";
export const CONSENT_VERSION = 1;
export const CONSENT_EVENT_NAME = "snapfreetools:consent-changed";

export const DEFAULT_CONSENT = {
  version: CONSENT_VERSION,
  necessary: true,
  preferences: false,
  analytics: false,
  advertising: false,
  method: "unknown",
  updatedAt: null,
};

export const ACCEPT_ALL_CONSENT = {
  version: CONSENT_VERSION,
  necessary: true,
  preferences: true,
  analytics: true,
  advertising: true,
  method: "accept_all",
};

export const REJECT_OPTIONAL_CONSENT = {
  version: CONSENT_VERSION,
  necessary: true,
  preferences: false,
  analytics: false,
  advertising: false,
  method: "reject_optional",
};
