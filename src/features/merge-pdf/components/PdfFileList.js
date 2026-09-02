import React, { useRef } from "react";
import { FileText, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Trash2, Plus, FilePlus } from "lucide-react";

export default function PdfFileList({
  files,
  onMoveUp,
  onMoveDown,
  onRemove,
  onAddMore,
  onClearAll,
  onReorder
}) {
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  // Helper for formatting file size
  const formatSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + " KB";
    return (kb / 1024).toFixed(1) + " MB";
  };

  // Drag & drop card handlers
  const handleDragStart = (e, index) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    dragOverItem.current = index;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      onReorder(dragItem.current, dragOverItem.current);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-slate-800 text-sm">
            PDF Sequence Workspace ({files.length} {files.length === 1 ? "File" : "Files"})
          </h3>
          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg">
            Files will merge in displayed order (#1 → #{files.length})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAddMore}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-all"
          >
            <Plus size={14} className="text-amber-500" /> Add More
          </button>
          
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex items-center gap-1 py-1.5 px-2.5 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-500 hover:text-red-500 font-bold text-xs rounded-xl transition-all"
            title="Clear all uploaded files"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Grid of PDF Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {files.map((fileItem, idx) => (
          <div
            key={fileItem.id}
            draggable
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragEnter={(e) => handleDragEnter(e, idx)}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all relative group cursor-grab active:cursor-grabbing"
          >
            {/* Sequence Order Badge */}
            <div className="flex items-center justify-between mb-3">
              <span className="bg-slate-900 text-white text-[11px] font-black px-2.5 py-0.5 rounded-lg shadow-2xs">
                #{idx + 1}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Order {idx + 1} of {files.length}
              </span>
            </div>

            {/* Thumbnail Preview Area */}
            <div className="relative w-full aspect-[1/1.3] bg-slate-50 border border-slate-150 rounded-2xl overflow-hidden mb-3 shadow-inner flex items-center justify-center p-2">
              {fileItem.thumbnailUrl ? (
                <img
                  src={fileItem.thumbnailUrl}
                  alt={`1st Page thumbnail of ${fileItem.name}`}
                  className="object-contain w-full h-full shadow-2xs rounded-md"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                  <FileText size={32} />
                  <span className="text-[10px] font-bold text-slate-400">PDF Preview</span>
                </div>
              )}
            </div>

            {/* Card Metadata Details */}
            <div className="space-y-2 mb-3">
              <h4 className="font-extrabold text-slate-800 text-xs truncate" title={fileItem.name}>
                {fileItem.name}
              </h4>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold border-t border-slate-50 pt-1.5">
                <span>{fileItem.pageCount} {fileItem.pageCount === 1 ? "Page" : "Pages"}</span>
                <span>{formatSize(fileItem.size)}</span>
              </div>
            </div>

            {/* Reordering & Action Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-1.5">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => onMoveUp(idx)}
                  className={`p-1.5 rounded-lg border transition-all ${
                    idx === 0
                      ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-600"
                  }`}
                  title="Move Left / Up"
                  aria-label="Move PDF Up in sequence"
                >
                  <ArrowLeft size={13} className="hidden sm:inline" />
                  <ArrowUp size={13} className="sm:hidden" />
                </button>

                <button
                  type="button"
                  disabled={idx === files.length - 1}
                  onClick={() => onMoveDown(idx)}
                  className={`p-1.5 rounded-lg border transition-all ${
                    idx === files.length - 1
                      ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-600"
                  }`}
                  title="Move Right / Down"
                  aria-label="Move PDF Down in sequence"
                >
                  <ArrowRight size={13} className="hidden sm:inline" />
                  <ArrowDown size={13} className="sm:hidden" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all"
                title="Remove file"
                aria-label="Remove PDF from list"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
