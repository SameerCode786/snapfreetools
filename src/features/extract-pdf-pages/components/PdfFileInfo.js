"use client";

import React from "react";
import { FileText, X, Layers } from "lucide-react";

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function PdfFileInfo({ file, pageCount, onRemove }) {
  if (!file) return null;

  const fileName = file.name || "document.pdf";
  const fileSize = file.size || 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xs max-w-3xl mx-auto">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
          <FileText size={22} />
        </div>

        <div className="min-w-0 space-y-0.5">
          <h3 className="font-black text-slate-900 text-sm truncate" title={fileName}>
            {fileName}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold flex-wrap">
            <span>{formatBytes(fileSize)}</span>
            {pageCount !== null && pageCount !== undefined && (
              <>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200/60 text-[11px] font-extrabold px-2 py-0.5 rounded-md">
                  <Layers size={11} className="text-amber-600" />
                  <span>{pageCount} {pageCount === 1 ? "page" : "pages"}</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
          title="Change or remove selected PDF"
          aria-label="Change PDF file"
        >
          <X size={14} />
          <span className="hidden sm:inline">Change File</span>
        </button>
      )}
    </div>
  );
}
