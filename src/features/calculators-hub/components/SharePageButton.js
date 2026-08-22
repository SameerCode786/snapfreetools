"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function SharePageButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: "Free Online Calculators | SnapFreeTools",
      text: "Explore free online calculators for finance, education, math, planning, and everyday needs.",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // If user cancelled, just return
        if (err.name !== "AbortError") {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 text-slate-700 hover:text-amber-600 font-bold text-sm rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
      aria-label="Share Calculators Hub"
    >
      {copied ? (
        <>
          <Check size={16} className="text-emerald-500" />
          <span className="text-emerald-600">Copied!</span>
        </>
      ) : (
        <>
          <Share2 size={16} />
          <span>Share Hub</span>
        </>
      )}
    </button>
  );
}
