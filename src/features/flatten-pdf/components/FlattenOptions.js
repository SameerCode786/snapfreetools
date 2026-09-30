"use client";

import React from "react";
import { FileText, Layers, RefreshCw, CheckCircle2, Lock, FileCheck } from "lucide-react";

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function FlattenOptions({ fileInfo, onFlatten, onChangeFile, isProcessing }) {
  if (!fileInfo) return null;

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-8 space-y-8 max-w-3xl mx-auto shadow-xs">
      
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm break-all">{fileInfo.name}</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              {formatBytes(fileInfo.byteSize)} • {fileInfo.pageCount} {fileInfo.pageCount === 1 ? "page" : "pages"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onChangeFile}
          disabled={isProcessing}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors shrink-0 disabled:opacity-50"
        >
          Change File
        </button>
      </div>

      {/* Detection Info Card */}
      <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Layers size={18} className="text-amber-500 shrink-0" />
          <h4 className="font-extrabold text-xs text-slate-900">Document Structure Detection</h4>
        </div>

        {fileInfo.fieldCount > 0 ? (
          <div className="space-y-1 text-xs">
            <p className="font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              Found {fileInfo.fieldCount} interactive form {fileInfo.fieldCount === 1 ? "field" : "fields"} to flatten
            </p>
            <p className="text-slate-500 font-medium pl-5 text-[11px]">
              Form field responses will be permanently baked into page vector graphics.
            </p>
          </div>
        ) : (
          <div className="space-y-1 text-xs">
            <p className="font-bold text-slate-700 flex items-center gap-1.5">
              <FileCheck size={16} className="text-amber-500 shrink-0" />
              Standard PDF Document Structure
            </p>
            <p className="text-slate-500 font-medium pl-5 text-[11px]">
              No active interactive AcroForm text fields detected. Processing will consolidate page graphics and widget layers.
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={onFlatten}
          disabled={isProcessing}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isProcessing ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Flattening PDF...
            </>
          ) : (
            <>
              <Lock size={16} />
              Flatten PDF Now
            </>
          )}
        </button>
      </div>

    </div>
  );
}
