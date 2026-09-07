import React from "react";
import { Download, Trash2, ArrowRight, Check, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { formatSize } from "@/features/image-compressor/utils/size-formatter";

export default function BeforeAfterPreview({
  original,
  result,
  isProcessing,
  onDownload,
  onRemove,
  onReset
}) {
  if (!original) return null;

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
          <Sparkles size={18} className="text-amber-500" />
          Live Before & After Comparison
        </h3>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRemove}
            className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Remove Image</span>
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ORIGINAL IMAGE CARD */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full">
              Original Image
            </span>
            <span className="text-xs font-bold text-slate-500">{original.aspectRatioStr}</span>
          </div>

          <div className="w-full h-48 sm:h-56 rounded-xl bg-slate-200/50 border border-slate-200/60 overflow-hidden flex items-center justify-center relative">
            <img
              src={original.objectUrl}
              alt={original.name}
              className="max-w-full max-h-full object-contain p-2"
            />
          </div>

          <div className="space-y-1 text-xs text-slate-700 font-medium">
            <div className="font-bold text-slate-900 truncate" title={original.name}>
              {original.name}
            </div>
            <div className="flex items-center justify-between text-slate-500 font-semibold pt-1">
              <span>{original.width} × {original.height} px</span>
              <span className="font-bold text-slate-800">{formatSize(original.size)}</span>
            </div>
          </div>
        </div>

        {/* RESIZED OUTPUT CARD */}
        <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white px-2.5 py-0.5 rounded-full">
              Resized Output
            </span>
            {result && <span className="text-xs font-bold text-amber-900">{result.aspectRatioStr}</span>}
          </div>

          <div className="w-full h-48 sm:h-56 rounded-xl bg-amber-100/30 border border-amber-200/60 overflow-hidden flex items-center justify-center relative">
            {isProcessing ? (
              <div className="flex flex-col items-center gap-2 text-amber-600">
                <RefreshCw size={24} className="animate-spin" />
                <span className="text-xs font-bold">Resizing Image...</span>
              </div>
            ) : result ? (
              <img
                src={result.blobUrl}
                alt={result.filename}
                className="max-w-full max-h-full object-contain p-2 animate-fadeIn"
              />
            ) : (
              <div className="text-xs text-slate-400 font-medium">Processing Output...</div>
            )}
          </div>

          {result && (
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="truncate">{result.filename}</span>
                <span className="text-amber-700 font-black">{formatSize(result.size)}</span>
              </div>

              <div className="flex items-center justify-between text-slate-600 font-semibold pt-0.5">
                <span className="flex items-center gap-1.5">
                  <span>{result.width} × {result.height} px</span>
                  {(result.width > original.width || result.height > original.height) && (
                    <span className="text-[9px] bg-blue-100 text-blue-800 font-extrabold px-1.5 py-0.5 rounded">
                      Upscaled
                    </span>
                  )}
                </span>

                {/* Savings Pill */}
                {result.isSaved ? (
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                    Saved {result.percentChange}%
                  </span>
                ) : (
                  <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    Output larger (+{result.percentChange}%)
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Download Action Footer */}
      {result && (
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-medium">
            Ready to download • Client-side processing complete.
          </div>

          <button
            type="button"
            onClick={onDownload}
            disabled={isProcessing}
            className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-black text-sm rounded-2xl shadow-md shadow-amber-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download size={18} />
            <span>Download Resized Image</span>
          </button>
        </div>
      )}
    </div>
  );
}
