"use client";

import React from "react";
import { Sparkles, FileText, ShieldCheck } from "lucide-react";

export default function OcrModeSelector({ ocrEnabled, setOcrEnabled }) {
  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <span>OCR Processing Options</span>
          </h3>
          <p className="text-xs font-semibold text-slate-500">
            Select how your PDF tables should be analyzed and extracted.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
          <ShieldCheck size={13} />
          <span>100% Free & Local</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* No OCR Option */}
        <div
          onClick={() => setOcrEnabled(false)}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
            !ocrEnabled
              ? "border-emerald-500 bg-emerald-50/50 shadow-xs"
              : "border-slate-200/80 hover:border-slate-300 bg-slate-50/30"
          }`}
        >
          <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
            !ocrEnabled ? "border-emerald-600 bg-emerald-600" : "border-slate-300 bg-white"
          }`}>
            {!ocrEnabled && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <FileText size={15} className={!ocrEnabled ? "text-emerald-600" : "text-slate-500"} />
              <span className="text-xs font-black text-slate-900">No OCR (Standard)</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
              Best for selectable-text PDFs created directly from spreadsheets, ERP, or accounting software.
            </p>
          </div>
        </div>

        {/* Free OCR Option */}
        <div
          onClick={() => setOcrEnabled(true)}
          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
            ocrEnabled
              ? "border-emerald-500 bg-emerald-50/50 shadow-xs"
              : "border-slate-200/80 hover:border-slate-300 bg-slate-50/30"
          }`}
        >
          <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
            ocrEnabled ? "border-emerald-600 bg-emerald-600" : "border-slate-300 bg-white"
          }`}>
            {ocrEnabled && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Sparkles size={15} className={ocrEnabled ? "text-emerald-600" : "text-amber-500"} />
              <span className="text-xs font-black text-slate-900">Free OCR (Scanned PDFs)</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
              Convert scanned and image-only PDFs using browser-based OCR with spatial table reconstruction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
