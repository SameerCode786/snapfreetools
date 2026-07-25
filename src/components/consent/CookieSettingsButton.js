"use client";

import React from "react";
import { openCookieSettings } from "@/lib/consent/consent-events";
import { Settings } from "lucide-react";

export default function CookieSettingsButton({ className }) {
  return (
    <button 
      onClick={openCookieSettings}
      className={className || "text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-1.5"}
      aria-label="Open Cookie Settings"
    >
      <Settings size={14} />
      <span>Cookie Settings</span>
    </button>
  );
}
