import React from "react";
import { Combine, FileCheck, AlertTriangle } from "lucide-react";

export default function MergeSettings({
  files,
  outputFilename,
  onFilenameChange,
  onMerge,
  isProcessing
}) {
  // Format total size helper
  const formatSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + " KB";
    return (kb / 1024).toFixed(1) + " MB";
  };

  const totalPages = files.reduce((acc, f) => acc + (f.pageCount || 0), 0);
  const totalSizeBytes = files.reduce((acc, f) => acc + (f.size || 0), 0);
  const canMerge = files.length >= 2;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
      
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Combine size={18} className="text-amber-500" />
        <h3 className="font-extrabold text-slate-800 text-sm">Merge Options & Summary</h3>
      </div>

      {/* Single PDF Alert Warning */}
      {!canMerge && (
        <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-100/80 rounded-2xl p-4 text-amber-800 text-xs font-semibold">
          <AlertTriangle size={16} className="text-amber-500 shrink-0" />
          <p>Please add at least <strong>two PDF files</strong> to perform a merge.</p>
        </div>
      )}

      {/* Summary Statistics Pill Grid */}
      <div className="grid grid-cols-3 gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Files</span>
          <span className="text-sm font-extrabold text-slate-800">{files.length}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Pages</span>
          <span className="text-sm font-extrabold text-slate-800">{totalPages}</span>
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Input Size</span>
          <span className="text-sm font-extrabold text-slate-800">{formatSize(totalSizeBytes)}</span>
        </div>
      </div>

      {/* Output Filename Configuration */}
      <div className="space-y-1.5">
        <label htmlFor="merged-filename-input" className="text-xs font-bold text-slate-650 block">
          Output PDF Filename
        </label>
        <div className="relative flex items-center">
          <input
            id="merged-filename-input"
            type="text"
            value={outputFilename}
            onChange={(e) => onFilenameChange(e.target.value)}
            placeholder="merged-document"
            className="w-full bg-white border border-slate-200 hover:border-slate-350 focus:border-amber-500 focus:ring-1 focus:ring-amber-250 outline-hidden py-2.5 pl-4 pr-14 rounded-xl text-xs font-semibold text-slate-800 transition-all placeholder:text-slate-300"
          />
          <span className="absolute right-4 text-xs font-bold text-slate-400 pointer-events-none">
            .pdf
          </span>
        </div>
      </div>

      {/* Primary CTA */}
      <button
        type="button"
        disabled={!canMerge || isProcessing}
        onClick={onMerge}
        className={`w-full py-3.5 px-6 text-xs font-extrabold rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
          !canMerge || isProcessing
            ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            : "bg-amber-500 hover:bg-amber-600 text-white font-extrabold"
        }`}
      >
        <Combine size={16} /> Merge PDFs
      </button>

    </div>
  );
}
