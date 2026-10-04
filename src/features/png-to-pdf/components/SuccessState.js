"use client";

import React from "react";
import { Download, CheckCircle2, RefreshCw, FileText } from "lucide-react";
import ShareSystem from "@/components/share";
import { formatBytes } from "./Workspace";

export default function SuccessState({ result, onReset }) {
  const { downloadUrl, filename = "converted-png-documents.pdf", pageCount = 0, fileSize = 0 } = result || {};

  const handleDownload = () => {
    if (!downloadUrl) return;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Success Card */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-xs">
        <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 size={36} />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-2xl font-black text-slate-900">
            PDF Generated Successfully!
          </h3>
          <p className="text-sm font-semibold text-slate-600">
            Converted <span className="font-bold text-slate-900">{pageCount}</span> {pageCount === 1 ? "PNG image" : "PNG images"} into a single PDF document.
          </p>
        </div>

        {/* File Detail Badge */}
        <div className="inline-flex items-center gap-3 bg-white border border-emerald-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs">
          <FileText size={16} className="text-emerald-600" />
          <span>{filename}</span>
          {fileSize > 0 && (
            <>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">{formatBytes(fileSize)}</span>
            </>
          )}
        </div>

        {/* Download & Start Over Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base rounded-2xl shadow-md transition-all inline-flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.01]"
          >
            <Download size={22} />
            <span>Download PDF</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-4 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-bold text-sm rounded-2xl transition-all inline-flex items-center justify-center gap-2 cursor-pointer bg-white"
          >
            <RefreshCw size={16} />
            <span>Convert More PNGs</span>
          </button>
        </div>
      </div>

      {/* Share System */}
      <div className="pt-2">
        <ShareSystem
          title="PNG to PDF Converter Free – SnapFreeTools"
          description="Convert PNG images to PDF documents online for free. 100% private client-side conversion."
        />
      </div>
    </div>
  );
}
