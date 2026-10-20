"use client";

import React from "react";
import { Loader2, Presentation, ShieldCheck, XCircle } from "lucide-react";

export default function ProcessingState({ progress, onCancel }) {
  const {
    current = 0,
    total = 0,
    percent = 0,
    stage = "Preparing presentation...",
    message = "Processing document in local browser memory..."
  } = progress || {};

  return (
    <div
      role="status"
      aria-live="polite"
      className="max-w-xl mx-auto text-center space-y-6 bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-xs"
    >
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-2xs relative">
        <Presentation size={32} />
        <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full animate-spin">
          <Loader2 size={14} />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900">
          Converting PowerPoint to PDF...
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-slate-600">
          {stage}
        </p>
        <p className="text-xs text-slate-400 font-medium">
          {message}
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-2 max-w-md mx-auto">
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/80 p-0.5">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-1">
          <span>{percent}% Complete</span>
          <span>
            {current > 0 ? `Slide ${current} of ${total}` : `${total} Slides Total`}
          </span>
        </div>
      </div>

      {onCancel && (
        <div className="pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-600 font-bold text-xs rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer bg-white"
          >
            <XCircle size={14} />
            <span>Cancel Conversion</span>
          </button>
        </div>
      )}

      <div className="pt-2 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
        <ShieldCheck size={16} className="text-emerald-500" />
        <span>100% Client-Side Processing • Zero Server Uploads</span>
      </div>
    </div>
  );
}
