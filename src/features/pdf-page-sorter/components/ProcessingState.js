"use client";

import React from "react";
import { Loader2, LayoutList } from "lucide-react";

export default function ProcessingState({ stepText = "Processing PDF pages..." }) {
  return (
    <div className="max-w-xl mx-auto py-16 px-6 text-center space-y-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm">
      <div className="relative inline-flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
          <LayoutList size={28} />
        </div>
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xs">
          <Loader2 size={16} className="animate-spin" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-black text-slate-900">
          Sorting PDF Document
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-sm mx-auto">
          {stepText}
        </p>
      </div>

      <div className="w-48 mx-auto bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div className="bg-amber-500 h-full w-2/3 animate-pulse rounded-full" />
      </div>
    </div>
  );
}
