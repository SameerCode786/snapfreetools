"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

export default function SharePreview({ result, dob }) {
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  // If there's no valid calculation yet, the button is disabled.
  const isDisabled = !dob || !result || result.error || !result.isValid;

  const getShareText = () => {
    if (isDisabled) return "";
    const { exact } = result;
    return `I am exactly ${exact.years} years, ${exact.months} months, and ${exact.days} days old! Calculate your exact age at SnapFreeTools.`;
  };

  const handleShare = async () => {
    if (isDisabled) return;
    
    const shareText = getShareText();
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        setSharing(true);
        await navigator.share({
          title: "My Exact Age | SnapFreeTools",
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          fallbackCopy(shareText, shareUrl);
        }
      } finally {
        setSharing(false);
      }
    } else {
      fallbackCopy(shareText, shareUrl);
    }
  };

  const fallbackCopy = async (text, url) => {
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard", err);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={isDisabled || sharing}
      className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all ${
        isDisabled
          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
          : copied
          ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
          : "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20"
      }`}
    >
      {copied ? (
        <>
          <Check size={20} />
          <span>Copied to Clipboard!</span>
        </>
      ) : (
        <>
          <Share2 size={20} />
          <span>{sharing ? "Sharing..." : "Share My Age"}</span>
        </>
      )}
    </button>
  );
}
