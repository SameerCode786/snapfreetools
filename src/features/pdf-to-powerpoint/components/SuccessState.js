"use client";

import React from "react";
import {
  Download,
  CheckCircle2,
  RefreshCw,
  Presentation,
  ArrowRight,
  ShieldCheck,
  Info,
  Sparkles,
  FileCheck
} from "lucide-react";
import ShareSystem from "@/components/share";

export default function SuccessState({ result, onReset }) {
  const {
    blob,
    filename = "presentation.pptx",
    convertedCount = 0,
    mode = "editable",
    preset = "match",
    slideWidth,
    slideHeight,
    scannedFallbackPages = []
  } = result || {};

  const handleDownload = () => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const modeLabel = mode === "editable" ? "Editable Content" : "High Fidelity";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Success Banner */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 sm:p-10 text-center space-y-5 shadow-xs">
        <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 size={36} />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            Conversion Complete!
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-lg mx-auto">
            Successfully generated your PowerPoint presentation (.pptx) with {convertedCount} {convertedCount === 1 ? "slide" : "slides"}.
          </p>
        </div>

        {/* Converted Document Stats Pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-white px-4 py-2 rounded-2xl border border-emerald-200/80 text-xs font-bold text-slate-700 shadow-2xs">
          <span className="text-slate-900 font-black">{filename}</span>
          <span>•</span>
          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            {modeLabel}
          </span>
          <span>•</span>
          <span className="text-slate-500">
            {convertedCount} {convertedCount === 1 ? "Slide" : "Slides"}
          </span>
          {slideWidth && slideHeight && (
            <>
              <span>•</span>
              <span className="text-slate-500">
                {slideWidth}" × {slideHeight}"
              </span>
            </>
          )}
        </div>

        {/* Informational Alert if Scanned Pages Used Image Fallback */}
        {scannedFallbackPages.length > 0 && (
          <div className="max-w-xl mx-auto p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-left flex items-start gap-3">
            <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <span className="font-bold">Image-Based Content Notice:</span>
              <p className="font-medium text-[11px] leading-relaxed">
                Pages {scannedFallbackPages.join(", ")} contained image-based or scanned content and were preserved as high-fidelity slide images for visual accuracy.
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleDownload}
            className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base rounded-2xl shadow-md transition-all inline-flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.01]"
          >
            <Download size={22} />
            <span>Download PowerPoint (.pptx)</span>
          </button>

          <button
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-4 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-bold text-sm rounded-2xl transition-all inline-flex items-center justify-center gap-2 cursor-pointer bg-white"
          >
            <RefreshCw size={16} />
            <span>Convert Another PDF</span>
          </button>
        </div>

        <div className="pt-2 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>Your document was processed locally and remained private at all times.</span>
        </div>
      </div>
    </div>
  );
}
