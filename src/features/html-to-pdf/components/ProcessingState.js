"use client";

import React from "react";
import { Loader2, X } from "lucide-react";

export default function ProcessingState({ stageText, mode, onCancel }) {
  const getModeLabel = () => {
    if (mode === "url") return "Webpage URL";
    if (mode === "html_paste") return "Pasted HTML";
    if (mode === "html_upload") return "Uploaded HTML File";
    return "HTML Content";
  };

  return (
    <div 
      role="status"
      aria-live="polite"
      className="py-12 sm:py-16 text-center space-y-6 max-w-md mx-auto"
    >
      {/* Animated Loader Icon */}
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 bg-amber-100 rounded-full animate-ping opacity-25" />
        <div className="relative w-20 h-20 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-lg">
          <Loader2 size={36} className="animate-spin" />
        </div>
      </div>

      {/* Stage Status Copy */}
      <div className="space-y-2">
        <h3 className="font-black text-slate-900 text-xl">
          Converting {getModeLabel()} to PDF...
        </h3>
        <p className="text-sm font-medium text-slate-600">
          {stageText || "Rendering HTML and generating high-quality PDF document..."}
        </p>
      </div>

      {/* Indeterminate Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 h-full w-2/3 rounded-full animate-pulse mx-auto" />
      </div>

      <p className="text-xs text-slate-400">
        This usually takes 2–5 seconds depending on webpage size and external assets.
      </p>

      {/* Cancel Action Button */}
      {onCancel && (
        <div className="pt-2">
          <button
            type="button"
            id="btn-cancel-conversion"
            onClick={onCancel}
            aria-label="Cancel HTML conversion process"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <X size={14} />
            Cancel Conversion
          </button>
        </div>
      )}
    </div>
  );
}
