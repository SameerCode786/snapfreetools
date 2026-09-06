import React from "react";
import { Scissors, FileCheck, Archive, Zap } from "lucide-react";

export default function ModeEveryPage({ totalPages }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
      <div className="space-y-1">
        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
          <Scissors className="text-amber-500" size={18} />
          Split Every Page
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          Convert this document into {totalPages} individual PDF files.
        </p>
      </div>

      <div className="bg-amber-50/60 border border-amber-200/80 p-5 rounded-2xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
            {totalPages}
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-amber-900">
              {totalPages} Single-Page PDF Files Will Be Created
            </h4>
            <p className="text-[11px] text-amber-700 font-medium">
              Each page of your document will be exported as its own standalone PDF file.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-amber-200/60 flex flex-wrap gap-4 text-xs font-semibold text-amber-800">
          <span className="flex items-center gap-1.5">
            <FileCheck size={14} /> Individual Download Buttons
          </span>
          <span className="flex items-center gap-1.5">
            <Archive size={14} /> Download All as ZIP Archive
          </span>
          <span className="flex items-center gap-1.5">
            <Zap size={14} /> 100% Vector Quality Preserved
          </span>
        </div>
      </div>
    </div>
  );
}
