"use client";

import React from "react";
import { Download, CheckCircle2, RefreshCw, FileText, Scaling } from "lucide-react";
import ShareSystem from "@/components/share";
import { convertPointsToMm } from "../utils/pdfResizeEngine.js";

export default function SuccessState({ result, onReset }) {
  const { downloadUrl, filename, resizedPageCount = 0, totalPages = 0, targetWidthPt = 0, targetHeightPt = 0 } = result || {};

  const handleDownload = () => {
    if (!downloadUrl) return;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename || "resized-document.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const widthMm = Math.round(convertPointsToMm(targetWidthPt));
  const heightMm = Math.round(convertPointsToMm(targetHeightPt));

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Success Banner */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 size={36} />
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl font-black text-slate-900">
            Your Resized PDF is Ready!
          </h3>
          <p className="text-sm font-semibold text-slate-600">
            Successfully resized {resizedPageCount} {resizedPageCount === 1 ? "page" : "pages"} to {widthMm} × {heightMm} mm ({Math.round(targetWidthPt)} × {Math.round(targetHeightPt)} pt).
          </p>
        </div>

        {/* Primary Download Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleDownload}
            className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base rounded-2xl shadow-md transition-all inline-flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.01]"
          >
            <Download size={22} />
            <span>Download Resized PDF</span>
          </button>

          <button
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-4 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-bold text-sm rounded-2xl transition-all inline-flex items-center justify-center gap-2 cursor-pointer bg-white"
          >
            <RefreshCw size={16} />
            <span>Resize Another PDF</span>
          </button>
        </div>
      </div>

      {/* Share System Integration */}
      <div className="pt-4">
        <ShareSystem
          title="Resize PDF Pages Free – SnapFreeTools"
          description="Resize PDF pages to standard sizes (A4, Letter, Legal) or custom dimensions online for free."
        />
      </div>
    </div>
  );
}
