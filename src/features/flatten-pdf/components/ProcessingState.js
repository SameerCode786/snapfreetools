"use client";

import React from "react";
import { RefreshCw, Lock } from "lucide-react";

export default function ProcessingState({ stepText }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center max-w-md mx-auto space-y-6 shadow-xs">
      <div className="relative w-16 h-16 mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 animate-pulse">
          <Lock size={28} />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
          <RefreshCw size={12} className="animate-spin" />
        </div>
      </div>

      <div className="space-y-1.5">
        <h3 className="font-extrabold text-slate-900 text-sm">Flattening PDF Document</h3>
        <p className="text-xs text-slate-500 font-medium">
          {stepText || "Processing interactive elements locally in browser..."}
        </p>
      </div>

      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div className="bg-amber-500 h-full w-2/3 animate-pulse rounded-full" />
      </div>

      <p className="text-[11px] text-slate-400 font-semibold">
        Your file remains 100% private inside browser memory.
      </p>
    </div>
  );
}
