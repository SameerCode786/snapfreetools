"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, Download, RefreshCw, FileSpreadsheet, ArrowRight, ShieldCheck, Share2 } from "lucide-react";
import ShareSystem from "@/components/share";

export default function SuccessState({ result, onReset }) {
  const [downloadUrl, setDownloadUrl] = useState(null);

  useEffect(() => {
    if (result && result.blob) {
      const url = URL.createObjectURL(result.blob);
      setDownloadUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [result]);

  const handleDownload = () => {
    if (!downloadUrl) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = result.filename || "converted-to-excel.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    if (bytes < 1024) return `${bytes} Bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Main Success Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 text-center space-y-8 shadow-xs">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-3xl flex items-center justify-center mx-auto shadow-2xs">
          <CheckCircle2 size={36} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Your Excel File is Ready!
          </h2>
          <p className="text-sm font-semibold text-slate-500 max-w-md mx-auto">
            Successfully extracted tabular data and generated an editable Microsoft Excel workbook (.xlsx).
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4 max-w-xl mx-auto text-left">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Original PDF</p>
            <p className="text-xs font-black text-slate-800">{formatFileSize(result.originalSize)}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Excel Workbook</p>
            <p className="text-xs font-black text-emerald-700">{formatFileSize(result.blob?.size)}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Worksheets</p>
            <p className="text-xs font-black text-slate-800">{result.tableCount} {result.tableCount === 1 ? "sheet" : "sheets"}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Rows</p>
            <p className="text-xs font-black text-slate-800">{result.totalRows} rows</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
          <button
            onClick={handleDownload}
            className="w-full sm:w-auto flex-1 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-sm rounded-2xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download size={18} />
            <span>Download Excel (.xlsx)</span>
          </button>
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-5 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <RefreshCw size={16} />
            <span>Convert Another PDF</span>
          </button>
        </div>

        {/* Privacy Note */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 pt-2">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>Processed 100% locally in your browser memory</span>
        </div>
      </div>

      {/* Share System */}
      <ShareSystem
        toolTitle="PDF to Excel Converter"
        toolSlug="pdf-to-excel"
      />
    </div>
  );
}
