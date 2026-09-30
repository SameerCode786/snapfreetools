import React from "react";
import { Loader2, XCircle, FileImage } from "lucide-react";

export default function ScanningProgress({
  progressInfo,
  filename,
  onCancel,
}) {
  const { currentPage = 0, totalPages = 0, imagesFound = 0, phase = "scanning" } =
    progressInfo || {};

  const percent =
    totalPages > 0 ? Math.min(Math.round((currentPage / totalPages) * 100), 100) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-xs space-y-6 text-center animate-fade">
      {/* Spinner / Icon */}
      <div className="w-14 h-14 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center mx-auto text-amber-500 shadow-inner relative">
        <Loader2 size={26} className="animate-spin text-amber-500" />
      </div>

      {/* Header & Status */}
      <div className="space-y-2">
        <h3 className="font-extrabold text-slate-800 text-base">
          {phase === "scanning"
            ? `Scanning PDF Pages (${currentPage} of ${totalPages || "..."})`
            : "Preparing PDF Engine..."}
        </h3>
        <p className="text-xs text-slate-400 font-medium truncate max-w-md mx-auto">
          {filename}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 max-w-md mx-auto">
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span>{percent}% Completed</span>
          <span className="flex items-center gap-1 text-amber-600 font-extrabold">
            <FileImage size={13} /> {imagesFound} image{imagesFound !== 1 ? "s" : ""} found
          </span>
        </div>
      </div>

      {/* Cancel Action */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 py-2.5 px-5 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-600 hover:text-red-600 text-xs font-bold rounded-xl transition-all active:scale-95"
        >
          <XCircle size={15} /> Cancel Extraction
        </button>
      </div>
    </div>
  );
}
