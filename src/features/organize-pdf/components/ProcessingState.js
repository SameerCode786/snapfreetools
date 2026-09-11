"use client";

import React from "react";
import { Loader2, ShieldCheck } from "lucide-react";

export default function ProcessingState({ stepText = "Applying new page sequence..." }) {
  return (
    <div className="max-w-md mx-auto py-12 px-6 text-center space-y-6 bg-white border border-slate-200/80 rounded-3xl shadow-xs">
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-amber-100 animate-ping opacity-25" />
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shadow-2xs">
          <Loader2 size={32} className="animate-spin text-amber-600" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-black text-slate-900">
          Organizing PDF Pages
        </h3>
        <p className="text-xs font-bold text-slate-500 transition-all">
          {stepText}
        </p>
      </div>

      {/* Honest status indicators */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-left space-y-2 max-w-xs mx-auto">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Structural Page Sequence Assembly</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Zero Quality Loss (No Rasterization)</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-slate-400">
        <ShieldCheck size={14} className="text-emerald-500" />
        <span>100% Client-Side Processing</span>
      </div>
    </div>
  );
}
