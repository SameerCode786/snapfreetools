"use client";

import React from "react";
import { RefreshCw, ShieldCheck } from "lucide-react";

export default function ProcessingState({ stepText = "Processing PDF document..." }) {
  return (
    <div className="w-full max-w-xl mx-auto py-16 px-6 bg-white border border-slate-200 rounded-3xl shadow-sm text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mx-auto shadow-sm">
        <RefreshCw size={32} className="animate-spin" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-extrabold text-slate-800">Exporting Annotated PDF</h3>
        <p className="text-sm font-medium text-slate-500">{stepText}</p>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full py-2 px-4 w-fit mx-auto">
        <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
        <span>100% Client-Side Vector Embedding</span>
      </div>
    </div>
  );
}
