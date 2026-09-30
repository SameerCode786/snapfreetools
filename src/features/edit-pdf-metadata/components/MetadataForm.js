import React from "react";
import {
  RotateCcw,
  Trash2,
  CheckCircle2,
  Download,
  Tag,
  Calendar,
  FileText,
  User,
  BookOpen,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";

export default function MetadataForm({
  originalMetadata,
  currentMetadata,
  onChange,
  onReset,
  onClear,
  onApply,
  onDownload,
  isDirty,
  hasApplied,
  isProcessing,
  originalFilename,
}) {
  const handleInputChange = (field, value) => {
    onChange({
      ...currentMetadata,
      [field]: value,
    });
  };

  const handleRevertField = (field) => {
    onChange({
      ...currentMetadata,
      [field]: originalMetadata[field] || "",
    });
  };

  // Keyword tag helper
  const keywordsList = (currentMetadata.keywords || "")
    .split(/[,;]/)
    .map((k) => k.trim())
    .filter(Boolean);

  const removeKeywordTag = (tagToRemove) => {
    const updated = keywordsList.filter((k) => k !== tagToRemove).join(", ");
    handleInputChange("keywords", updated);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-extrabold text-slate-800 text-base flex items-center justify-center sm:justify-start gap-2">
            <SlidersIcon size={18} className="text-amber-500" />
            PDF Metadata Editor
          </h3>
          <p className="text-xs text-slate-400 font-medium truncate max-w-md">
            {originalFilename || "Document.pdf"} ({originalMetadata?.pageCount || 1} Page{originalMetadata?.pageCount !== 1 ? "s" : ""})
          </p>
        </div>

        {/* Status Badge & Global Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {isDirty ? (
            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-500 animate-pulse" /> Unsaved Changes
            </span>
          ) : hasApplied ? (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" /> Metadata Updated
            </span>
          ) : (
            <span className="bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl">
              Original Metadata
            </span>
          )}
        </div>
      </div>

      {/* Main Form Inputs Grid */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="pdf-title-input" className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <FileText size={14} className="text-amber-500" /> Title
              </label>
              {currentMetadata.title !== originalMetadata.title && (
                <button
                  type="button"
                  onClick={() => handleRevertField("title")}
                  className="text-[10px] font-extrabold text-amber-600 hover:underline flex items-center gap-1"
                >
                  <RotateCcw size={10} /> Revert
                </button>
              )}
            </div>
            <input
              id="pdf-title-input"
              type="text"
              value={currentMetadata.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="e.g. Annual Financial Report 2026"
              className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 rounded-2xl px-4 py-3 text-xs text-slate-800 font-bold focus:outline-none transition-all"
            />
            <div className="text-[10px] text-slate-400 text-right font-medium">
              {(currentMetadata.title || "").length} characters
            </div>
          </div>

          {/* Author Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="pdf-author-input" className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <User size={14} className="text-amber-500" /> Author
              </label>
              {currentMetadata.author !== originalMetadata.author && (
                <button
                  type="button"
                  onClick={() => handleRevertField("author")}
                  className="text-[10px] font-extrabold text-amber-600 hover:underline flex items-center gap-1"
                >
                  <RotateCcw size={10} /> Revert
                </button>
              )}
            </div>
            <input
              id="pdf-author-input"
              type="text"
              value={currentMetadata.author || ""}
              onChange={(e) => handleInputChange("author", e.target.value)}
              placeholder="e.g. Jane Doe / Corporate Department"
              className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 rounded-2xl px-4 py-3 text-xs text-slate-800 font-bold focus:outline-none transition-all"
            />
            <div className="text-[10px] text-slate-400 text-right font-medium">
              {(currentMetadata.author || "").length} characters
            </div>
          </div>

          {/* Subject Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="pdf-subject-input" className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <BookOpen size={14} className="text-amber-500" /> Subject / Description
              </label>
              {currentMetadata.subject !== originalMetadata.subject && (
                <button
                  type="button"
                  onClick={() => handleRevertField("subject")}
                  className="text-[10px] font-extrabold text-amber-600 hover:underline flex items-center gap-1"
                >
                  <RotateCcw size={10} /> Revert
                </button>
              )}
            </div>
            <input
              id="pdf-subject-input"
              type="text"
              value={currentMetadata.subject || ""}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              placeholder="e.g. Q4 Performance & Strategic Planning"
              className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 rounded-2xl px-4 py-3 text-xs text-slate-800 font-bold focus:outline-none transition-all"
            />
            <div className="text-[10px] text-slate-400 text-right font-medium">
              {(currentMetadata.subject || "").length} characters
            </div>
          </div>

          {/* Keywords Input with Tags */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="pdf-keywords-input" className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Tag size={14} className="text-amber-500" /> Keywords (comma-separated)
              </label>
              {currentMetadata.keywords !== originalMetadata.keywords && (
                <button
                  type="button"
                  onClick={() => handleRevertField("keywords")}
                  className="text-[10px] font-extrabold text-amber-600 hover:underline flex items-center gap-1"
                >
                  <RotateCcw size={10} /> Revert
                </button>
              )}
            </div>
            <input
              id="pdf-keywords-input"
              type="text"
              value={currentMetadata.keywords || ""}
              onChange={(e) => handleInputChange("keywords", e.target.value)}
              placeholder="e.g. report, finance, 2026, audit"
              className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 rounded-2xl px-4 py-3 text-xs text-slate-800 font-bold focus:outline-none transition-all"
            />
            {/* Keyword Chips */}
            {keywordsList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {keywordsList.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeKeywordTag(tag)}
                      className="hover:text-red-500 transition-colors"
                      title={`Remove tag ${tag}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Creator Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="pdf-creator-input" className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Cpu size={14} className="text-amber-500" /> Creator Application
              </label>
              {currentMetadata.creator !== originalMetadata.creator && (
                <button
                  type="button"
                  onClick={() => handleRevertField("creator")}
                  className="text-[10px] font-extrabold text-amber-600 hover:underline flex items-center gap-1"
                >
                  <RotateCcw size={10} /> Revert
                </button>
              )}
            </div>
            <input
              id="pdf-creator-input"
              type="text"
              value={currentMetadata.creator || ""}
              onChange={(e) => handleInputChange("creator", e.target.value)}
              placeholder="e.g. Microsoft Word / Adobe InDesign"
              className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 rounded-2xl px-4 py-3 text-xs text-slate-800 font-bold focus:outline-none transition-all"
            />
          </div>

          {/* Producer Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="pdf-producer-input" className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Layers size={14} className="text-amber-500" /> Producer Engine
              </label>
              {currentMetadata.producer !== originalMetadata.producer && (
                <button
                  type="button"
                  onClick={() => handleRevertField("producer")}
                  className="text-[10px] font-extrabold text-amber-600 hover:underline flex items-center gap-1"
                >
                  <RotateCcw size={10} /> Revert
                </button>
              )}
            </div>
            <input
              id="pdf-producer-input"
              type="text"
              value={currentMetadata.producer || ""}
              onChange={(e) => handleInputChange("producer", e.target.value)}
              placeholder="e.g. pdf-lib / SnapFreeTools"
              className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 rounded-2xl px-4 py-3 text-xs text-slate-800 font-bold focus:outline-none transition-all"
            />
          </div>

          {/* Creation Date Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="pdf-creation-date-input" className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Calendar size={14} className="text-amber-500" /> Creation Date
              </label>
            </div>
            <input
              id="pdf-creation-date-input"
              type="datetime-local"
              value={
                currentMetadata.creationDate
                  ? new Date(currentMetadata.creationDate).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) => handleInputChange("creationDate", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 rounded-2xl px-4 py-3 text-xs text-slate-800 font-bold focus:outline-none transition-all"
            />
          </div>

          {/* Modification Date Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="pdf-mod-date-input" className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                <Calendar size={14} className="text-amber-500" /> Modification Date
              </label>
            </div>
            <input
              id="pdf-mod-date-input"
              type="datetime-local"
              value={
                currentMetadata.modificationDate
                  ? new Date(currentMetadata.modificationDate).toISOString().slice(0, 16)
                  : ""
              }
              onChange={(e) => handleInputChange("modificationDate", e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 rounded-2xl px-4 py-3 text-xs text-slate-800 font-bold focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Global Action Button Controls */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onReset}
              disabled={!isDirty}
              className={`py-2.5 px-4 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 w-full sm:w-auto ${
                isDirty
                  ? "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                  : "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
              }`}
            >
              <RotateCcw size={13} /> Reset Changes
            </button>
            <button
              type="button"
              onClick={onClear}
              className="py-2.5 px-4 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-700 hover:text-red-600 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 w-full sm:w-auto"
            >
              <Trash2 size={13} /> Clear All Metadata
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onApply}
              disabled={isProcessing}
              className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 w-full sm:w-auto"
            >
              <CheckCircle2 size={15} className="text-amber-400" /> Apply Metadata Changes
            </button>

            {hasApplied && (
              <button
                type="button"
                onClick={onDownload}
                className="py-2.5 px-6 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 w-full sm:w-auto animate-bounce"
              >
                <Download size={15} /> Download Edited PDF
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SlidersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="4" y1="21" y2="14" />
      <line x1="4" x2="4" y1="10" y2="3" />
      <line x1="12" x2="12" y1="21" y2="12" />
      <line x1="12" x2="12" y1="8" y2="3" />
      <line x1="20" x2="20" y1="21" y2="16" />
      <line x1="20" x2="20" y1="12" y2="3" />
      <line x1="2" x2="6" y1="14" y2="14" />
      <line x1="10" x2="14" y1="8" y2="8" />
      <line x1="18" x2="22" y1="16" y2="16" />
    </svg>
  );
}
