"use client";

import React from "react";
import { Loader2, FileImage, ShieldCheck } from "lucide-react";

export default function ProcessingState({ progress }) {
  const { current = 0, total = 0, stage = "Converting PNG images..." } = progress || {};
  const percent = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <div className="max-w-xl mx-auto text-center space-y-6 bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-12 shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-2xs relative">
        <FileImage size={32} />
        <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full animate-spin">
          <Loader2 size={14} />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-black text-slate-900">
          Converting PNG to PDF...
        </h3>
        <p className="text-sm font-semibold text-slate-500">
          {stage || `Processing image ${current} of ${total}`}
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-2 max-w-md mx-auto">
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200/80 p-0.5">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 px-1">
          <span>{percent}% Complete</span>
          <span>
            {current} / {total} {total === 1 ? "Image" : "Images"}
          </span>
        </div>
      </div>

      <div className="pt-2 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
        <ShieldCheck size={16} className="text-emerald-500" />
        <span>Client-side conversion running in browser memory</span>
      </div>
    </div>
  );
}
