"use client";

import React from "react";
import { Download, CheckCircle2, RotateCcw, FileText, Info } from "lucide-react";

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function ResultState({ result, onReset }) {
  if (!result) return null;

  const { blob, pdfBytes, filename, pageCount, originalSize, outputSize, processingTime, dpi } = result;

  const handleDownload = () => {
    let url;
    if (blob) {
      url = URL.createObjectURL(blob);
    } else if (pdfBytes) {
      const b = new Blob([pdfBytes], { type: "application/pdf" });
      url = URL.createObjectURL(b);
    }

    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "document-grayscale.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  const sizeDiff = originalSize - outputSize;
  const isSmaller = sizeDiff > 0;
  const percentChange = originalSize > 0 ? Math.abs(Math.round((sizeDiff / originalSize) * 100)) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 max-w-xl mx-auto space-y-6 shadow-xs">
      {/* Success Badge Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 mx-auto flex items-center justify-center text-emerald-500 shadow-xs">
          <CheckCircle2 size={36} />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            PDF Converted to Grayscale!
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Your document has been processed into crisp monochrome pages.
          </p>
        </div>
      </div>

      {/* Metrics Card */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-200/60 pb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-extrabold text-xs shrink-0">
            <FileText size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-extrabold text-slate-900 text-xs truncate" title={filename}>
              {filename}
            </p>
            <p className="text-[11px] text-slate-500 font-semibold">
              {pageCount} {pageCount === 1 ? "Page" : "Pages"} • {dpi} DPI Resolution
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white p-3 rounded-xl border border-slate-200/60">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Original Size</p>
            <p className="text-sm font-black text-slate-700 mt-0.5">{formatBytes(originalSize)}</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-amber-200/80">
            <p className="text-[10px] font-black text-amber-700 uppercase tracking-wider">Grayscale Size</p>
            <p className="text-sm font-black text-slate-900 mt-0.5">{formatBytes(outputSize)}</p>
          </div>
        </div>

        {processingTime && (
          <div className="text-center text-[11px] text-slate-400 font-semibold pt-1">
            Processed locally in { (processingTime / 1000).toFixed(2) } seconds
          </div>
        )}
      </div>

      {/* Honest Limitation Disclosure */}
      <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-4 flex items-start gap-3 text-amber-900">
        <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs font-medium leading-relaxed">
          <strong>Visual Preservation Note:</strong> Page layouts, colors, and graphics have been rendered into crisp grayscale pixels. Selectable vector text is flattened into the page graphics layer.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={handleDownload}
          className="w-full py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-black text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Download size={20} />
          <span>Download Grayscale PDF</span>
        </button>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>Convert Another PDF File</span>
          </button>
        )}
      </div>
    </div>
  );
}
