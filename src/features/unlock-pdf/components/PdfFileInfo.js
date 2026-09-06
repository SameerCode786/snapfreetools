import React from "react";
import { FileText, Trash2, Lock, Unlock, ShieldCheck, AlertCircle } from "lucide-react";
import { formatFileSize } from "../utils/formatters";

export default function PdfFileInfo({ fileInfo, onRemove }) {
  if (!fileInfo) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        
        {/* Left: Thumbnail & Metadata */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {fileInfo.firstPageThumbnail ? (
            <div className="w-14 h-18 bg-slate-100 border border-slate-200 rounded-xl overflow-hidden shrink-0 shadow-xs flex items-center justify-center">
              <img 
                src={fileInfo.firstPageThumbnail} 
                alt="PDF Preview Thumbnail" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-14 h-18 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <Lock size={28} />
            </div>
          )}

          <div className="min-w-0 flex-1 space-y-1">
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base truncate" title={fileInfo.name}>
              {fileInfo.name}
            </h4>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
              <span>Size: <strong className="text-slate-700">{formatFileSize(fileInfo.size)}</strong></span>
              {fileInfo.pageCount !== null && (
                <>
                  <span>•</span>
                  <span>Pages: <strong className="text-slate-700">{fileInfo.pageCount}</strong></span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Remove Button */}
        <button
          onClick={onRemove}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all self-end sm:self-center cursor-pointer"
          title="Remove file"
        >
          <Trash2 size={16} />
          <span>Remove</span>
        </button>
      </div>

      {/* PDF Metadata Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
          <span className="font-bold text-slate-500">Protection Status:</span>
          {fileInfo.isProtected ? (
            <span className="inline-flex items-center gap-1.5 font-extrabold text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-full border border-amber-200">
              <Lock size={12} /> Password Protected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-200">
              <Unlock size={12} /> Unprotected PDF
            </span>
          )}
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between">
          <span className="font-bold text-slate-500">Processing Status:</span>
          {fileInfo.isProtected ? (
            <span className="font-extrabold text-slate-800">Ready to Unlock</span>
          ) : (
            <span className="font-extrabold text-emerald-700">No Password Required</span>
          )}
        </div>
      </div>
    </div>
  );
}
