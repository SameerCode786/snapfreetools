"use client";

import React from "react";
import { PenTool } from "lucide-react";

export default function ProcessingState({ stepText = "Applying signatures to PDF..." }) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-xs space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
        <PenTool size={32} className="animate-bounce" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-black text-slate-900">Signing PDF Document...</h3>
        <p className="text-sm font-semibold text-slate-500 max-w-sm mx-auto">{stepText}</p>
      </div>
    </div>
  );
}
