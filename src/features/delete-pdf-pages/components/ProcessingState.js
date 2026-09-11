"use client";

import React from "react";
import { Loader2, Trash2, ShieldCheck } from "lucide-react";

export default function ProcessingState({ stepText = "Deleting selected PDF pages..." }) {
  return (
    <div className="max-w-md mx-auto py-12 px-6 text-center space-y-6 bg-white border border-slate-200/80 rounded-3xl shadow-xs">
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-red-100 animate-ping opacity-25" />
        <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shadow-2xs">
          <Loader2 size={32} className="animate-spin text-red-600" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-black text-slate-900">
          Removing PDF Pages
        </h3>
        <p className="text-xs font-bold text-slate-500 transition-all">
          {stepText}
        </p>
      </div>

      {/* honest status indicators */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4 text-left space-y-2 max-w-xs mx-auto">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>Structural Page Removal</span>
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
