"use client";

import React, { useState } from "react";
import { PLATFORMS } from "../constants/platforms";
import { buildPlatformShareUrl, getCanonicalToolUrl } from "../utils/platformShareUrls";
import { Check, Info } from "lucide-react";

export default function SocialButtons({ 
  shareText, 
  shareTitle, 
  shareUrl,
  allowedPlatforms = ["native", "copy", "whatsapp", "email", "twitter", "facebook", "linkedin", "instagram"]
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [showInstaNotice, setShowInstaNotice] = useState(false);

  const targetUrl = getCanonicalToolUrl(shareUrl);

  const handlePlatformClick = async (platformId) => {
    // 1. Native Share
    if (platformId === "native") {
      if (typeof navigator !== "undefined" && navigator.share) {
        try {
          await navigator.share({
            title: shareTitle || "SnapFreeTools",
            text: shareText,
            url: targetUrl
          });
        } catch (err) {
          if (err.name !== "AbortError") {
            handleCopyAction("native", targetUrl);
          }
        }
      } else {
        handleCopyAction("native", targetUrl);
      }
      return;
    }

    // 2. Copy Link / Direct Copy Action
    if (platformId === "copy") {
      handleCopyAction("copy", targetUrl);
      return;
    }

    // 3. Instagram Fallback
    if (platformId === "instagram") {
      try {
        const fullPayload = `${shareText}\n\n${targetUrl}`;
        await navigator.clipboard.writeText(fullPayload);
        setCopiedId("instagram");
        setShowInstaNotice(true);
        setTimeout(() => setCopiedId(null), 3000);
        setTimeout(() => setShowInstaNotice(false), 5000);
      } catch (err) {
        console.error("Instagram copy failed:", err);
      }
      return;
    }

    // 4. External URL Platforms (WhatsApp, X, Facebook, LinkedIn, Email)
    const externalUrl = buildPlatformShareUrl(platformId, {
      url: targetUrl,
      shareText: shareText,
      title: shareTitle
    });

    if (externalUrl) {
      if (platformId === "email") {
        window.open(externalUrl, "_self");
      } else {
        window.open(externalUrl, "_blank", "noopener,noreferrer");
      }
    }
  };

  const handleCopyAction = async (id, textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Filter supported platforms
  const visiblePlatforms = PLATFORMS.filter((p) => {
    if (!allowedPlatforms.includes(p.id)) return false;
    if (p.id === "native") {
      return typeof navigator !== "undefined" && typeof navigator.share === "function";
    }
    return true;
  });

  return (
    <div className="space-y-4 w-full">
      {/* Centered Wrap Grid of Pill Buttons (Matches Screenshot Reference) */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 w-full">
        {visiblePlatforms.map((platform) => {
          const Icon = platform.icon;
          const isCopied = copiedId === platform.id;
          const displayLabel = isCopied 
            ? (platform.id === "instagram" ? "Copied Text!" : "Copied Link!") 
            : platform.label;

          return (
            <button
              key={platform.id}
              type="button"
              onClick={() => handlePlatformClick(platform.id)}
              aria-label={`Share via ${platform.label}`}
              className={`py-2.5 px-4 sm:px-5 ${platform.bgClass} border border-slate-200 ${platform.colorClass} font-bold text-xs sm:text-sm rounded-xl shadow-2xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 shrink-0`}
            >
              {isCopied ? (
                <Check size={16} className="text-emerald-500 animate-in fade-in" />
              ) : (
                <Icon size={16} className="shrink-0" />
              )}
              <span className="truncate">{displayLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Instagram Copy Fallback Notification Toast */}
      {showInstaNotice && (
        <div 
          role="status" 
          aria-live="polite" 
          className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 max-w-md mx-auto text-amber-800 text-xs font-semibold animate-slide"
        >
          <Info size={16} className="shrink-0 text-amber-500" />
          <span>Result text copied! Open Instagram and paste it in your story or message.</span>
        </div>
      )}
    </div>
  );
}
