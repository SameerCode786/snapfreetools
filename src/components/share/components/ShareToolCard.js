"use client";

import React from "react";
import { Share2 } from "lucide-react";
import SocialButtons from "./SocialButtons";
import { buildToolShareText } from "../utils/shareTextBuilder";

export default function ShareToolCard({ toolName = "Tool", toolUrl }) {
  const shareText = buildToolShareText(toolName, toolUrl);
  const shareTitle = `Share ${toolName} — SnapFreeTools`;

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-50/70 border border-slate-200/80 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xs">
      
      {/* Centered Heading with Orange Share Icon (Matches Screenshot Reference) */}
      <div className="flex items-center justify-center gap-2 text-slate-800">
        <Share2 size={18} className="text-amber-500 shrink-0" />
        <h3 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-slate-900">
          Share This Tool
        </h3>
      </div>

      {/* Reusable Social Buttons Strip */}
      <SocialButtons
        shareText={shareText}
        shareTitle={shareTitle}
        shareUrl={toolUrl}
      />

    </div>
  );
}
