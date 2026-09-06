import React from "react";
import { Download, RefreshCw, CheckCircle2, ShieldCheck, FileText } from "lucide-react";
import { formatFileSize } from "../utils/formatters";

export default function UnlockResults({ result, onReset }) {
  if (!result) return null;

  const { url, filename, pageCount, size, originalName } = result;

  const handleDownload = () => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 text-center space-y-8 max-w-3xl mx-auto shadow-xs">
      {/* Success Badge Header */}
      <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
        <CheckCircle2 size={36} />
      </div>

      {/* Heading */}
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          PDF Unlocked Successfully!
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-md mx-auto leading-relaxed">
          Your PDF document is now unencrypted and ready to open, view, print, or edit on any device without password security prompts.
        </p>
      </div>

      {/* Result Metadata Box */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Document</span>
          <div className="text-sm font-black text-slate-800 truncate" title={filename}>{filename}</div>
        </div>

        <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-3">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Pages / Size</span>
          <div className="text-sm font-black text-slate-900">{pageCount} p • {formatFileSize(size)}</div>
        </div>

        <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-3">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Security Status</span>
          <div>
            <span className="inline-block bg-emerald-100 text-emerald-800 font-extrabold text-xs px-2.5 py-1 rounded-full border border-emerald-200">
              Unencrypted
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2 max-w-md mx-auto">
        <button
          onClick={handleDownload}
          className="bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer flex-1"
        >
          <Download size={18} />
          <span>Download Unlocked PDF</span>
        </button>

        <button
          onClick={onReset}
          className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer shadow-2xs"
        >
          <RefreshCw size={16} />
          <span>Unlock Another PDF</span>
        </button>
      </div>
    </div>
  );
}
