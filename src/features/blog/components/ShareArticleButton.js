"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareArticleButton({ title, excerpt, url }) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    const fullUrl = url || typeof window !== 'undefined' ? window.location.href : '';

    if (navigator.share) {
      try {
        setSharing(true);
        await navigator.share({
          title: title,
          text: excerpt,
          url: fullUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          fallbackCopy(fullUrl);
        }
      } finally {
        setSharing(false);
      }
    } else {
      fallbackCopy(fullUrl);
    }
  };

  const fallbackCopy = async (fullUrl) => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={sharing}
      className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-slate-200 ${
        copied
          ? "bg-green-50 text-green-600 border border-green-200"
          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
      }`}
    >
      {copied ? (
        <>
          <Check size={16} />
          <span>Link Copied!</span>
        </>
      ) : (
        <>
          <Share2 size={16} />
          <span>{sharing ? "Sharing..." : "Share Article"}</span>
        </>
      )}
    </button>
  );
}
