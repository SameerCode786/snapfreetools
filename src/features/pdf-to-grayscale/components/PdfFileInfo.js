"use client";

import React from "react";
import { FileText, X } from "lucide-react";

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function PdfFileInfo({ file, pageCount, onRemove }) {
  if (!file) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xs max-w-xl mx-auto">
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
          <FileText size={24} />
        </div>

        <div className="min-w-0 space-y-0.5">
          <h3 className="font-extrabold text-slate-900 text-sm truncate" title={file.name}>
            {file.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <span>{formatBytes(file.size)}</span>
            {pageCount !== null && pageCount !== undefined && (
              <>
                <span>•</span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {pageCount} {pageCount === 1 ? "Page" : "Pages"}
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
          className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors shrink-0"
          title="Remove file"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
