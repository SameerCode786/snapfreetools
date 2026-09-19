"use client";

import React from "react";
import { Download, CheckCircle2, RefreshCw, FileCheck, ShieldCheck, PenTool } from "lucide-react";
import ShareSystem from "@/components/share";

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function SignPdfSuccess({ result, onReset }) {
  const {
    downloadUrl,
    filename,
    totalPages,
    signedPageCount,
    totalSignaturesPlaced,
    originalSize,
    signedSize,
    blob
  } = result || {};

  const originalSizeStr = formatBytes(originalSize);
  const signedSizeStr = formatBytes(signedSize || (blob ? blob.size : null));

  return (
    <div className="max-w-3xl mx-auto text-left space-y-6">
      {/* Main Success Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left border-b border-slate-100 pb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
            <CheckCircle2 size={32} />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/60 inline-block">
              PDF Signed Successfully
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Your Signed PDF is Ready!
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              {totalSignaturesPlaced} {totalSignaturesPlaced === 1 ? "signature" : "signatures"} embedded across {signedPageCount} of {totalPages} {totalPages === 1 ? "page" : "pages"}. Original text, vectors, and layout remain intact.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          <div className="text-center p-2">
            <div className="text-[11px] font-bold text-slate-400">Total Pages</div>
            <div className="text-base sm:text-lg font-black text-slate-800 mt-0.5">
              {totalPages}
            </div>
          </div>

          <div className="text-center p-2 border-l border-slate-200/80">
            <div className="text-[11px] font-bold text-emerald-600">Signed Pages</div>
            <div className="text-base sm:text-lg font-black text-emerald-600 mt-0.5">
              {signedPageCount}
            </div>
          </div>

          <div className="text-center p-2 border-l border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-400">Signatures</div>
            <div className="text-base sm:text-lg font-black text-slate-800 mt-0.5">
              {totalSignaturesPlaced}
            </div>
          </div>

          <div className="text-center p-2 border-l border-slate-200/80">
            <div className="text-[11px] font-bold text-slate-400">File Size</div>
            <div className="text-base sm:text-lg font-black text-slate-800 mt-0.5">
              {signedSizeStr}
            </div>
          </div>
        </div>

        {/* File Download Section */}
        <div className="p-5 bg-slate-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-white/10 text-emerald-400 flex items-center justify-center shrink-0">
              <FileCheck size={22} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-black text-white truncate max-w-xs sm:max-w-sm">
                {filename}
              </div>
              <div className="text-xs font-bold text-slate-400 mt-0.5">
                {signedSizeStr} • Electronic Signature Embedded
              </div>
            </div>
          </div>

          <a
            href={downloadUrl}
            download={filename}
            className="w-full sm:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-slate-950 font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Download size={18} />
            <span>Download Signed PDF</span>
          </a>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Sign Another PDF</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-500">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>100% Client-Side In Browser</span>
          </div>
        </div>
      </div>

      {/* Share System Integration */}
      <ShareSystem
        title="Sign PDF Online Free – SnapFreeTools"
        url="https://www.snapfreetools.com/sign-pdf"
        toolSlug="sign-pdf"
      />
    </div>
  );
}
