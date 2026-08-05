"use client";

import React, { useState, useEffect, useRef } from "react";
import { Icons } from "@/lib/lucide-icons";

export default function ShareResultButton({ shareText }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const menuRef = useRef(null);

  const url = "https://www.snapfreetools.com/attendance-calculator";
  const shortText = "I calculated my attendance and requirements using the SnapFreeTools Attendance Calculator.";

  // Handle click outside to close the menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    
    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Attendance Calculator Result",
          text: shareText,
          url: url
        });
      } catch (err) {
        // Fallback to menu if share sheet was aborted or failed
        if (err.name !== "AbortError") {
          setIsOpen(true);
        }
      }
    } else {
      setIsOpen(true);
    }
  };

  const handleCopyResult = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  return (
    <div className="relative inline-block w-full sm:w-auto" ref={menuRef}>
      <button
        onClick={handleShareClick}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-6 rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2 shadow-sm"
      >
        <Icons.Share2 size={16} />
        Share Result
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50">
          <ul className="flex flex-col text-sm font-semibold text-slate-700">
            <li>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full p-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Icons.MessageCircle size={16} />
                </div>
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shortText)}&url=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full p-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Icons.Twitter size={16} />
                </div>
                X (Twitter)
              </a>
            </li>
            <li>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full p-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <Icons.Facebook size={16} />
                </div>
                Facebook
              </a>
            </li>
            <li>
              <a
                href={`mailto:?subject=${encodeURIComponent("Attendance Calculator Result")}&body=${encodeURIComponent(shareText)}`}
                className="flex items-center gap-3 w-full p-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Icons.Mail size={16} />
                </div>
                Email
              </a>
            </li>
            <div className="h-px bg-slate-100 my-1"></div>
            <li>
              <button
                onClick={handleCopyResult}
                className="flex items-center gap-3 w-full p-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <Icons.Copy size={16} />
                </div>
                {copiedText ? <span className="text-emerald-600 font-bold" aria-live="polite">Result copied!</span> : "Copy Result Text"}
              </button>
            </li>
            <li>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-3 w-full p-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <Icons.Link size={16} />
                </div>
                {copiedLink ? <span className="text-emerald-600 font-bold" aria-live="polite">Link copied!</span> : "Copy Link"}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
