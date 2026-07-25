"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X, Check } from "lucide-react";
import { 
  DEFAULT_CONSENT, 
  ACCEPT_ALL_CONSENT, 
  REJECT_OPTIONAL_CONSENT 
} from "@/lib/consent/consent-types";
import { saveConsent } from "@/lib/consent/consent-storage";

export default function CookiePreferencesPanel({ isOpen, onClose, initialConsent }) {
  const [draft, setDraft] = useState(initialConsent || DEFAULT_CONSENT);
  const panelRef = useRef(null);

  // Sync draft when initial changes
  useEffect(() => {
    if (isOpen) {
      setDraft(initialConsent || DEFAULT_CONSENT);
    }
  }, [isOpen, initialConsent]);

  // Focus trap and escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    
    // Simple focus management: focus first element
    if (panelRef.current) {
      const focusable = panelRef.current.querySelector("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
      if (focusable) focusable.focus();
    }
    
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggle = (category) => {
    if (category === "necessary") return; // Cannot toggle necessary
    setDraft(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleSave = () => {
    saveConsent({
      ...draft,
      method: "custom"
    });
    onClose();
  };

  const handleAcceptAll = () => {
    saveConsent(ACCEPT_ALL_CONSENT);
    onClose();
  };

  const handleRejectOptional = () => {
    saveConsent(REJECT_OPTIONAL_CONSENT);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-preferences-title"
    >
      <div 
        ref={panelRef}
        className="bg-white w-full sm:w-[600px] max-h-[90vh] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 id="cookie-preferences-title" className="text-xl font-bold text-slate-900">
            Cookie Preferences
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            aria-label="Close preferences"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6">
          <p className="text-sm text-slate-600 leading-relaxed">
            SnapFreeTools uses essential technologies to operate. You can choose whether to allow optional technologies.
          </p>

          <div className="space-y-4">
            {/* Necessary */}
            <div className="flex items-start justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="pr-4">
                <h3 className="font-bold text-slate-900 text-sm mb-1">Strictly Necessary</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Required for core website operation and security.</p>
              </div>
              <div className="shrink-0 flex items-center justify-center w-12 h-6 bg-slate-300 rounded-full cursor-not-allowed">
                <div className="w-5 h-5 bg-white rounded-full translate-x-3 flex items-center justify-center">
                  <Check size={12} className="text-slate-400" />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="flex items-start justify-between p-4 border border-slate-200 rounded-xl hover:border-emerald-200 transition-colors">
              <div className="pr-4">
                <h3 className="font-bold text-slate-900 text-sm mb-1">Preferences</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Remembers optional interface and tool settings.</p>
              </div>
              <button 
                type="button"
                role="switch"
                aria-checked={draft.preferences}
                onClick={() => handleToggle("preferences")}
                className={`shrink-0 relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${draft.preferences ? 'bg-emerald-500' : 'bg-slate-200'}`}
                aria-label="Toggle Preferences"
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${draft.preferences ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Analytics */}
            <div className="flex items-start justify-between p-4 border border-slate-200 rounded-xl hover:border-emerald-200 transition-colors">
              <div className="pr-4">
                <h3 className="font-bold text-slate-900 text-sm mb-1">Analytics</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Would help measure website usage and performance if analytics is activated later.</p>
              </div>
              <button 
                type="button"
                role="switch"
                aria-checked={draft.analytics}
                onClick={() => handleToggle("analytics")}
                className={`shrink-0 relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${draft.analytics ? 'bg-emerald-500' : 'bg-slate-200'}`}
                aria-label="Toggle Analytics"
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${draft.analytics ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Advertising */}
            <div className="flex items-start justify-between p-4 border border-slate-200 rounded-xl hover:border-emerald-200 transition-colors">
              <div className="pr-4">
                <h3 className="font-bold text-slate-900 text-sm mb-1">Advertising</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Would allow advertising and related measurement technologies if ads are activated later.</p>
              </div>
              <button 
                type="button"
                role="switch"
                aria-checked={draft.advertising}
                onClick={() => handleToggle("advertising")}
                className={`shrink-0 relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${draft.advertising ? 'bg-emerald-500' : 'bg-slate-200'}`}
                aria-label="Toggle Advertising"
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${draft.advertising ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
          
          <div className="text-xs text-slate-500 text-center">
            View our <Link href="/cookie-policy" className="underline hover:text-emerald-600">Cookie Policy</Link> for detailed information.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-3 sm:justify-between">
          <div className="flex gap-3 w-full sm:w-auto">
            <button 
              onClick={handleRejectOptional}
              className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
            >
              Reject Optional
            </button>
            <button 
              onClick={handleAcceptAll}
              className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors"
            >
              Accept All
            </button>
          </div>
          <button 
            onClick={handleSave}
            className="w-full sm:w-auto px-6 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors shadow-sm"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
