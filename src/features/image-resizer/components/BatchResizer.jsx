import React from "react";
import { Download, Trash2, Layers, Check, RefreshCw, Sparkles, Plus } from "lucide-react";
import { formatSize } from "@/features/image-compressor/utils/size-formatter";

export default function BatchResizer({
  batchItems,
  onRemoveItem,
  onDownloadItem,
  onDownloadAll,
  onClearAll,
  onAddMore
}) {
  if (!batchItems || batchItems.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Layers size={18} className="text-amber-500" />
            Batch Image Resizing ({batchItems.length} Images)
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            All images are processed locally using your current resize settings.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onAddMore}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
          >
            <Plus size={14} />
            <span>Add More</span>
          </button>

          <button
            type="button"
            onClick={onClearAll}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
          >
            <Trash2 size={14} />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Batch Items List */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {batchItems.map((item, idx) => {
          const { original, result, isProcessing, error } = item;
          return (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all hover:bg-slate-100/50"
            >
              {/* Thumbnail & Info */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src={original.objectUrl}
                    alt={original.name}
                    className="w-full h-full object-contain p-1"
                  />
                </div>

                <div className="min-w-0 space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 truncate" title={original.name}>
                    {original.name}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-400">
                    Original: {original.width}×{original.height} ({formatSize(original.size)})
                  </div>
                </div>
              </div>

              {/* Output Info */}
              <div className="text-left sm:text-right shrink-0 space-y-0.5">
                {isProcessing ? (
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                    <RefreshCw size={12} className="animate-spin" /> Processing...
                  </span>
                ) : result ? (
                  <>
                    <div className="text-xs font-black text-slate-900">
                      {result.width}×{result.height} px
                    </div>
                    <div className="text-[11px] font-bold text-amber-700">
                      {formatSize(result.size)} ({result.isSaved ? `Saved ${result.percentChange}%` : "Output larger"})
                    </div>
                  </>
                ) : error ? (
                  <span className="text-xs font-bold text-red-600">Failed</span>
                ) : null}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0">
                {result && (
                  <button
                    type="button"
                    onClick={() => onDownloadItem(item)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onRemoveItem(idx)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Download All Footer */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={onDownloadAll}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-2xl shadow-md shadow-amber-500/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <Download size={16} />
          <span>Download All Resized Images</span>
        </button>
      </div>

    </div>
  );
}
