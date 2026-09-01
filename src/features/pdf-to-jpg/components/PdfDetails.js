import React, { useState, useEffect } from "react";
import { FileText, Settings, Play, ArrowLeft, Trash2, CheckCircle2 } from "lucide-react";

export default function PdfDetails({
  file,
  pageCount,
  thumbnails,
  settings,
  onChangeSetting,
  onConvert,
  onClear,
  selectedPages,
  onTogglePageSelect
}) {
  const [pageRangeText, setPageRangeText] = useState("");
  const [rangeError, setRangeError] = useState(null);

  // Format file size helper
  const formatSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + " KB";
    return (kb / 1024).toFixed(1) + " MB";
  };

  // Sync range setting when pageRangeText changes
  const handleRangeChange = (e) => {
    const val = e.target.value;
    setPageRangeText(val);
    
    if (!val.trim()) {
      setRangeError("Please specify a page range (e.g., 2-5).");
      onChangeSetting("pageRange", "");
      return;
    }

    // Validate range regex (e.g. 2-5, or single page like 3)
    const rangeRegex = /^(\d+)-(\d+)$/;
    const singleRegex = /^(\d+)$/;

    if (rangeRegex.test(val.trim())) {
      const [, start, end] = val.trim().match(rangeRegex);
      const startNum = parseInt(start, 10);
      const endNum = parseInt(end, 10);

      if (startNum < 1 || endNum < 1) {
        setRangeError("Page numbers must be 1 or greater.");
        onChangeSetting("pageRange", "");
      } else if (startNum > pageCount || endNum > pageCount) {
        setRangeError(`Page numbers cannot exceed total pages (${pageCount}).`);
        onChangeSetting("pageRange", "");
      } else if (startNum > endNum) {
        setRangeError("Start page cannot be greater than end page.");
        onChangeSetting("pageRange", "");
      } else {
        setRangeError(null);
        onChangeSetting("pageRange", `${startNum}-${endNum}`);
      }
    } else if (singleRegex.test(val.trim())) {
      const pageNum = parseInt(val.trim(), 10);
      if (pageNum < 1 || pageNum > pageCount) {
        setRangeError(`Page number must be between 1 and ${pageCount}.`);
        onChangeSetting("pageRange", "");
      } else {
        setRangeError(null);
        onChangeSetting("pageRange", `${pageNum}-${pageNum}`);
      }
    } else {
      setRangeError("Invalid format. Use page range format (e.g. 1-5 or 3).");
      onChangeSetting("pageRange", "");
    }
  };

  // Reset range input error if pageMode changes
  useEffect(() => {
    setRangeError(null);
    if (settings.pageMode !== "range") {
      setPageRangeText("");
      onChangeSetting("pageRange", "");
    }
  }, [settings.pageMode]);

  // Determine if convert button should be disabled
  const isRangeModeInvalid = settings.pageMode === "range" && (!settings.pageRange || rangeError);
  const isSelectedModeInvalid = settings.pageMode === "selected" && selectedPages.length === 0;
  const isConvertDisabled = isRangeModeInvalid || isSelectedModeInvalid;

  // Display only first 12 pages to avoid UI lagging
  const visibleThumbnails = thumbnails.slice(0, 12);
  const hiddenCount = pageCount - 12;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Page Previews Workspace Area (Left col-span-7) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <FileText size={18} className="text-amber-500" />
              PDF Pages Preview ({pageCount} Pages)
            </h3>
            {settings.pageMode === "selected" && (
              <p className="text-[10px] text-amber-600 font-bold bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-lg animate-pulse">
                Click pages to select/uncheck
              </p>
            )}
          </div>

          {/* Thumbnails grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {visibleThumbnails.map((thumb) => {
              const isSelected = selectedPages.includes(thumb.pageNumber);
              const isSelectMode = settings.pageMode === "selected";
              
              return (
                <div
                  key={thumb.pageNumber}
                  onClick={() => isSelectMode && onTogglePageSelect(thumb.pageNumber)}
                  className={`group relative bg-slate-50 border rounded-2xl overflow-hidden p-3 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all ${
                    isSelectMode ? "cursor-pointer" : ""
                  } ${
                    isSelectMode && isSelected 
                      ? "border-amber-500 bg-amber-50/10 ring-1 ring-amber-400" 
                      : "border-slate-200 hover:border-slate-350"
                  }`}
                >
                  {/* Page index badge */}
                  <span className="absolute top-2 left-2 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                    Page {thumb.pageNumber}
                  </span>

                  {/* Thumbnail sheet */}
                  <div className="relative w-full aspect-[1/1.4] bg-white border border-slate-150 rounded-xl overflow-hidden mb-2 flex items-center justify-center">
                    {thumb.url ? (
                      <img
                        src={thumb.url}
                        alt={`Page ${thumb.pageNumber}`}
                        className="object-contain w-full h-full shadow-2xs"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                        <FileText size={24} className="animate-pulse" />
                      </div>
                    )}

                    {/* Selected Overlay indicator */}
                    {isSelectMode && isSelected && (
                      <div className="absolute inset-0 bg-amber-500/10 flex items-center justify-center">
                        <div className="bg-amber-500 text-white p-1 rounded-full shadow-md animate-scale">
                          <CheckCircle2 size={16} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* +N More pages badge */}
            {hiddenCount > 0 && (
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center text-slate-400 aspect-[1/1.4] relative">
                <FileText size={28} className="text-slate-300 mb-2" />
                <span className="text-sm font-extrabold text-slate-650">+ {hiddenCount} More Pages</span>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1 max-w-[100px]">
                  All pages will convert to JPG
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PDF Details and Settings Panel (Right col-span-5) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* PDF Metadata Summary */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shrink-0">
              <FileText size={20} />
            </div>
            <div className="min-w-0 flex-1 py-0.5">
              <h4 className="font-extrabold text-slate-800 text-sm truncate" title={file.name}>
                {file.name}
              </h4>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">
                {formatSize(file.size)} • {pageCount} Pages
              </p>
            </div>
          </div>
        </div>

        {/* Configurations Box */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Settings size={18} className="text-slate-500" />
            <h3 className="font-extrabold text-slate-800 text-sm">Conversion Settings</h3>
          </div>

          {/* Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-550 uppercase tracking-wider block">Page Selection</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "all", label: "All Pages" },
                { id: "range", label: "Page Range" },
                { id: "selected", label: "Selected" }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChangeSetting("pageMode", opt.id)}
                  className={`py-2 px-1 text-center font-bold text-xs rounded-xl border transition-all ${
                    settings.pageMode === opt.id
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mode inputs details */}
          {settings.pageMode === "range" && (
            <div className="space-y-1.5 animate-slide">
              <label className="text-xs font-bold text-slate-500 block" htmlFor="page-range-input">
                Enter Page Range:
              </label>
              <input
                id="page-range-input"
                type="text"
                value={pageRangeText}
                onChange={handleRangeChange}
                placeholder={`Example: 1-${pageCount} or 3`}
                className="w-full bg-white border border-slate-200 hover:border-slate-350 focus:border-amber-500 focus:ring-1 focus:ring-amber-250 outline-hidden py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-800 transition-all placeholder:text-slate-300"
              />
              {rangeError ? (
                <p className="text-[10px] text-red-500 font-semibold leading-relaxed flex items-center gap-1">
                  ⚠ {rangeError}
                </p>
              ) : (
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  Enter single page number or range separated by hyphen.
                </p>
              )}
            </div>
          )}

          {settings.pageMode === "selected" && (
            <div className="bg-amber-50/30 border border-amber-100/60 p-3.5 rounded-2xl text-xs text-slate-650 space-y-1 animate-slide font-medium leading-relaxed">
              <p className="font-bold text-amber-700">Custom Page Extraction Mode</p>
              <p>Click PDF pages in the preview grid on the left to select which sheets to convert.</p>
              <p className="font-semibold text-slate-500 mt-1">
                Selected Count: <strong className="text-slate-800">{selectedPages.length}</strong>
              </p>
            </div>
          )}

          {/* DPI Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-550 uppercase tracking-wider block">Resolution (DPI)</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "72", label: "72 DPI", desc: "Screen/Web" },
                { id: "150", label: "150 DPI", desc: "Standard" },
                { id: "300", label: "300 DPI", desc: "Print/HD" }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChangeSetting("dpi", opt.id)}
                  className={`py-2 px-1 text-center font-bold rounded-xl border transition-all flex flex-col items-center justify-center ${
                    settings.dpi === opt.id
                      ? "bg-slate-900 border-slate-900 text-white"
                      : "bg-white border-slate-200 text-slate-650 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <span className="text-xs font-bold">{opt.label}</span>
                  <span className={`text-[8px] font-medium opacity-70 mt-0.5 ${
                    settings.dpi === opt.id ? "text-amber-350" : "text-slate-400"
                  }`}>{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quality selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-550 uppercase tracking-wider block">Compression Quality</label>
            <select
              value={settings.quality}
              onChange={(e) => onChangeSetting("quality", e.target.value)}
              className="w-full bg-white border border-slate-200 hover:border-slate-350 focus:border-amber-500 focus:ring-1 focus:ring-amber-250 outline-hidden py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-800 transition-all cursor-pointer"
            >
              <option value="standard">Standard Quality (Small File)</option>
              <option value="high">High Quality (Balanced Output)</option>
              <option value="maximum">Maximum Quality (Lossless Detail)</option>
            </select>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              disabled={isConvertDisabled}
              onClick={onConvert}
              className={`w-full py-3 px-6 text-xs font-extrabold rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                isConvertDisabled
                  ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-amber-500 hover:bg-amber-600 text-white font-extrabold"
              }`}
            >
              <Play size={14} fill="currentColor" /> Convert to JPG
            </button>
            
            <button
              type="button"
              onClick={onClear}
              className="w-full py-3 px-6 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-600 hover:text-red-500 text-xs font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <Trash2 size={14} /> Clear PDF
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
