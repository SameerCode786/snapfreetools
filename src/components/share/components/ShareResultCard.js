"use client";

import React from "react";
import { Share2, Sparkles } from "lucide-react";
import SocialButtons from "./SocialButtons";
import { buildResultShareText } from "../utils/shareTextBuilder";

export default function ShareResultCard({
  toolName = "Tool",
  toolUrl,
  result,
  customFormatter
}) {
  // 1. Result-Aware Guard: Hide if result is absent, empty, or invalid
  if (!result) return null;
  if (typeof result === "object" && (result.isEmpty || Object.keys(result).length === 0)) {
    return null;
  }

  // 2. Build dynamic share text
  const shareText = buildResultShareText({
    toolName,
    toolUrl,
    result,
    customFormatter
  });

  const shareTitle = `My ${toolName} Result — SnapFreeTools`;

  return (
    <div className="w-full max-w-4xl mx-auto bg-gradient-to-b from-amber-50/50 to-slate-50/70 border border-amber-200/80 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xs animate-fade">
      
      {/* Centered Heading */}
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-2 text-slate-900">
          <Sparkles size={18} className="text-amber-500 shrink-0" />
          <h3 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-slate-900">
            Share Your Result
          </h3>
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Help others by sharing your calculation or conversion summary!
        </p>
      </div>

      {/* Social Action Strip */}
      <SocialButtons
        shareText={shareText}
        shareTitle={shareTitle}
        shareUrl={toolUrl}
      />

    </div>
  );
}
