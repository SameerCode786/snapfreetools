"use client";

import React from "react";
import { RotateCw, ShieldCheck } from "lucide-react";

export default function ProcessingState({ progress }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-10 sm:p-14 text-center max-w-xl mx-auto space-y-6 shadow-xs my-8">
      <div className="w-16 h-16 rounded-3xl bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center mx-auto animate-spin">
        <RotateCw size={32} />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-black text-slate-900">
          Rotating Your PDF Pages...
        </h3>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          {progress.message || "Applying rotations natively inside browser memory..."}
        </p>
      </div>

      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-amber-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${Math.max(10, progress.percent || 20)}%` }}
        />
      </div>

      <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
        <ShieldCheck size={14} className="text-emerald-500" />
        <span>100% Client-Side Processing • No Server Uploads</span>
      </div>
    </div>
  );
}
