"use client";

import React from "react";
import { Download, CheckCircle2, RefreshCw, FileCheck, ShieldCheck, LayoutGrid } from "lucide-react";
import ShareSystem from "@/components/share";

// Format file size in readable units
function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function OrganizeSuccess({ result, onReset }) {
  const {
    downloadUrl,
    filename,
    originalPageCount,
    organizedPageCount,
    blob
  } = result || {};

  const fileSize = blob ? formatBytes(blob.size) : null;

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
              PDF Pages Reordered Successfully
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Your Organized PDF is Ready!
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500">
              All {organizedPageCount} pages were arranged in your custom order. Original quality, selectable text, and formatting are 100% preserved.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
          <div className="text-center p-2">
            <div className="text-xs font-bold text-slate-400">Original Pages</div>
            <div className="text-lg sm:text-xl font-black text-slate-800 mt-0.5">
              {originalPageCount} {originalPageCount === 1 ? "page" : "pages"}
            </div>
          </div>

          <div className="text-center p-2 border-l border-slate-200/80">
            <div className="text-xs font-bold text-amber-600 flex items-center justify-center gap-1">
              <LayoutGrid size={12} />
              <span>Organized Pages</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-amber-600 mt-0.5">
              {organizedPageCount} {organizedPageCount === 1 ? "page" : "pages"}
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
              {fileSize && (
                <div className="text-xs font-bold text-slate-400 mt-0.5">
                  Size: {fileSize} • Structural PDF Assembly
                </div>
              )}
            </div>
          </div>

          <a
            href={downloadUrl}
            download={filename}
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Download size={18} />
            <span>Download PDF</span>
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl border border-slate-200/80 transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Organize Another PDF</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-400">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>100% Private Client-Side Reordering</span>
          </div>
        </div>

      </div>

      {/* Centralized Share System */}
      <ShareSystem
        toolName="Organize & Reorder PDF Pages"
        toolSlug="organize-pdf"
      />

    </div>
  );
}
