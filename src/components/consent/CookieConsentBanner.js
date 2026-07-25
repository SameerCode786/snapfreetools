"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { ACCEPT_ALL_CONSENT, REJECT_OPTIONAL_CONSENT } from "@/lib/consent/consent-types";
import { saveConsent } from "@/lib/consent/consent-storage";
import CookiePreferencesPanel from "./CookiePreferencesPanel";

export default function CookieConsentBanner({ onResolved }) {
  const [showPreferences, setShowPreferences] = useState(false);

  const handleAcceptAll = () => {
    saveConsent(ACCEPT_ALL_CONSENT);
    onResolved();
  };

  const handleRejectOptional = () => {
    saveConsent(REJECT_OPTIONAL_CONSENT);
    onResolved();
  };

  const handlePreferencesClosed = () => {
    // If they closed the preferences panel, check if consent was saved
    // This assumes they might have hit "Save" or just closed it
    // If they just hit close (escape/X), banner should remain open
    // We let the parent Provider decide if it should be hidden based on storage
    setShowPreferences(false);
  };

  return (
    <>
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 md:p-8 flex justify-center pointer-events-none"
        aria-live="polite"
      >
        <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 p-6 pointer-events-auto flex flex-col lg:flex-row items-start lg:items-center gap-6 animate-in slide-in-from-bottom-8 fade-in duration-300">
          
          <div className="flex-1 flex gap-4">
            <div className="hidden sm:flex shrink-0 w-12 h-12 bg-emerald-50 rounded-full items-center justify-center text-emerald-600">
              <Cookie size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-2">Your privacy choices</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                We use essential browser technologies to operate SnapFreeTools. With your permission, optional analytics and advertising technologies may be used in the future. You can accept, reject, or customize your choices.
              </p>
              <div className="flex gap-4 mt-2 text-xs font-semibold">
                <Link href="/cookie-policy" className="text-emerald-600 hover:text-emerald-700 hover:underline">Cookie Policy</Link>
                <Link href="/privacy-policy" className="text-emerald-600 hover:text-emerald-700 hover:underline">Privacy Policy</Link>
                <Link href="/advertising-disclosure" className="text-emerald-600 hover:text-emerald-700 hover:underline">Advertising Disclosure</Link>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 shrink-0">
            <button 
              onClick={() => setShowPreferences(true)}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors focus:ring-2 focus:ring-slate-200 focus:outline-none"
            >
              Customize
            </button>
            <button 
              onClick={handleRejectOptional}
              className="px-5 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors focus:ring-2 focus:ring-emerald-200 focus:outline-none"
            >
              Reject Optional
            </button>
            <button 
              onClick={handleAcceptAll}
              className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-sm focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 focus:outline-none"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>

      <CookiePreferencesPanel 
        isOpen={showPreferences} 
        onClose={handlePreferencesClosed} 
      />
    </>
  );
}
