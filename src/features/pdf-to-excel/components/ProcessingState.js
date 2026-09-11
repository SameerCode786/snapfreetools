"use client";

import React from "react";
import { FileSpreadsheet } from "lucide-react";

export default function ProcessingState({ stepText = "Extracting table data..." }) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-xs space-y-6">
      <div className="relative w-20 h-20 mx-auto">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-xs">
          <FileSpreadsheet size={36} className="animate-pulse" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-black text-slate-900">
          Generating Excel Workbook...
        </h3>
        <p className="text-sm font-semibold text-slate-500 max-w-sm mx-auto">
          {stepText}
        </p>
      </div>

      <div className="pt-2 flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
        <span>Processing client-side in your browser memory</span>
      </div>
    </div>
  );
}
