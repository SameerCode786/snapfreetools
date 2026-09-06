import React from "react";
import { FileText, Trash2, Scissors, FileCheck, Layers, Grid, SlidersHorizontal } from "lucide-react";
import { formatFileSize } from "../utils/pdfSplitterEngine";

const MODES = [
  {
    id: "specific-pages",
    title: "Extract Specific Pages",
    description: "Extract specific page numbers or ranges (e.g. 1, 3, 5-10) into one PDF.",
    icon: FileText
  },
  {
    id: "every-page",
    title: "Split Every Page",
    description: "Turn document into single-page PDF files.",
    icon: Scissors
  },
  {
    id: "custom-ranges",
    title: "Split by Custom Ranges",
    description: "Group pages into multiple PDF documents.",
    icon: Layers
  },
  {
    id: "every-n-pages",
    title: "Split Every N Pages",
    description: "Divide PDF at uniform page intervals.",
    icon: SlidersHorizontal
  },
  {
    id: "visual-selection",
    title: "Visual Page Selection",
    description: "Click thumbnails to visually choose pages.",
    icon: Grid
  }
];

export default function PdfAnalysisCard({ file, activeMode, onSelectMode, onResetFile }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
      {/* File Header Details */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-16 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden">
            {file.firstPageThumbnail ? (
              <img src={file.firstPageThumbnail} alt="PDF preview" className="w-full h-full object-cover" />
            ) : (
              <FileText size={24} className="text-red-500" />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-900 text-sm md:text-base line-clamp-1 max-w-md">
              {file.name}
            </h3>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
              <span className="bg-slate-100 px-2.5 py-0.5 rounded-full text-slate-700 font-bold">
                {file.pageCount} {file.pageCount === 1 ? "Page" : "Pages"}
              </span>
              <span>{formatFileSize(file.size)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onResetFile}
          className="text-xs font-bold text-slate-400 hover:text-red-600 flex items-center gap-1.5 transition-colors self-end sm:self-center bg-slate-50 hover:bg-red-50 px-3 py-2 rounded-xl border border-slate-200 hover:border-red-200"
        >
          <Trash2 size={14} /> Change PDF
        </button>
      </div>

      {/* Mode Switcher Selector Cards */}
      <div className="space-y-3">
        <label className="text-xs font-black uppercase tracking-wider text-slate-400 block">
          Select Split Mode
        </label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            const isSelected = activeMode === mode.id;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onSelectMode(mode.id)}
                className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 relative ${
                  isSelected 
                    ? "bg-amber-50/80 border-amber-500 shadow-sm ring-2 ring-amber-500/20" 
                    : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${isSelected ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                  <Icon size={18} />
                </div>
                <div className="space-y-0.5">
                  <h4 className={`text-xs font-bold ${isSelected ? "text-amber-900" : "text-slate-900"}`}>
                    {mode.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-snug font-medium">
                    {mode.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
