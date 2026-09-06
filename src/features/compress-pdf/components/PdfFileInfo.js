import React from "react";
import { FileText, Trash2, FileCheck, Layers } from "lucide-react";
import { formatFileSize } from "../utils/formatters";

export default function PdfFileInfo({ fileInfo, onRemove }) {
  if (!fileInfo) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        {/* Left: Thumbnail & File Metadata */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {fileInfo.firstPageThumbnail ? (
            <div className="w-14 h-18 bg-slate-100 border border-slate-200 rounded-xl overflow-hidden shrink-0 shadow-xs flex items-center justify-center">
              <img 
                src={fileInfo.firstPageThumbnail} 
                alt="PDF Thumbnail Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-14 h-18 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <FileText size={28} />
            </div>
          )}

          <div className="min-w-0 flex-1 space-y-1">
            <h4 className="font-extrabold text-slate-900 text-sm truncate" title={fileInfo.name}>
              {fileInfo.name}
            </h4>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
              <span>Size: <strong className="text-slate-700">{formatFileSize(fileInfo.size)}</strong></span>
              <span>•</span>
              <span>Pages: <strong className="text-slate-700">{fileInfo.pageCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Remove Button */}
        <button
          onClick={onRemove}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all self-end sm:self-center cursor-pointer"
          title="Remove and upload another PDF"
        >
          <Trash2 size={16} />
          <span>Remove</span>
        </button>

      </div>
    </div>
  );
}
