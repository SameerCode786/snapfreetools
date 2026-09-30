"use client";

import React from "react";
import { CheckCircle2, Download, RefreshCw, FileText, EyeOff, ShieldCheck } from "lucide-react";

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function RedactSuccess({ result, onReset }) {
  if (!result) return null;

  const handleDownload = () => {
    if (!result.downloadUrl) return;
    const a = document.createElement("a");
    a.href = result.downloadUrl;
    a.download = result.fileName || "redacted-document.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-8 space-y-8 max-w-xl mx-auto shadow-xs text-center">
      
      {/* Success Badge */}
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 mx-auto flex items-center justify-center text-emerald-500 shadow-xs">
        <CheckCircle2 size={32} />
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-black text-slate-900 tracking-tight">
          PDF Redacted & Sanitized Successfully!
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Confidential text and target areas have been permanently purged and covered.
        </p>
      </div>

      {/* Result Metrics */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-3 text-left">
        <div className="flex items-center gap-3">
          <FileText size={20} className="text-amber-500 shrink-0" />
          <div className="overflow-hidden">
            <h4 className="font-extrabold text-xs text-slate-900 truncate">
              {result.fileName}
            </h4>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              {formatBytes(result.byteSize)} • {result.pageCount} {result.pageCount === 1 ? "page" : "pages"}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200/60 pt-3 flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>Redaction Regions Applied:</span>
          <span className="font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-md text-[11px]">
            {result.redactionsAppliedCount} region(s) permanently redacted
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleDownload}
          className="w-full sm:w-auto flex-1 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download size={16} />
          Download Redacted PDF
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw size={14} />
          Redact Another PDF
        </button>
      </div>

      <p className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
        <ShieldCheck size={14} className="text-emerald-500" />
        Processed 100% locally in browser memory. No files were uploaded.
      </p>

    </div>
  );
}
