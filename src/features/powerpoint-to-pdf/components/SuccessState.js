"use client";

import React from "react";
import Link from "next/link";
import {
  Download,
  CheckCircle2,
  RefreshCw,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Presentation,
  FileDown
} from "lucide-react";
import ShareSystem from "@/components/share";

export default function SuccessState({ result, onReset }) {
  const {
    blob,
    filename = "presentation.pdf",
    pageCount = 0,
    fileSize = 0,
    aspectRatio = "16:9 Widescreen"
  } = result || {};

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleDownload = () => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Success Banner */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-3xl p-6 sm:p-10 text-center space-y-5 shadow-xs">
        <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 size={36} />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
            PDF Ready!
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-lg mx-auto">
            Successfully converted your PowerPoint presentation into a high-quality PDF with {pageCount} {pageCount === 1 ? "page" : "pages"}.
          </p>
        </div>

        {/* Converted Document Stats Pill */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-white px-4 py-2 rounded-2xl border border-emerald-200/80 text-xs font-bold text-slate-700 shadow-2xs">
          <span className="text-slate-900 font-black">{filename}</span>
          <span>•</span>
          <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            {pageCount} {pageCount === 1 ? "Page" : "Pages"}
          </span>
          <span>•</span>
          <span className="text-slate-500">{formatFileSize(fileSize)}</span>
          <span>•</span>
          <span className="text-slate-600">{aspectRatio}</span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleDownload}
            className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base rounded-2xl shadow-md transition-all inline-flex items-center justify-center gap-3 cursor-pointer hover:scale-[1.01]"
          >
            <Download size={22} />
            <span>Download PDF</span>
          </button>

          <button
            onClick={onReset}
            className="w-full sm:w-auto px-6 py-4 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 font-bold text-sm rounded-2xl transition-all inline-flex items-center justify-center gap-2 cursor-pointer bg-white"
          >
            <RefreshCw size={16} />
            <span>Convert Another Presentation</span>
          </button>
        </div>

        <div className="pt-2 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>Your document was processed locally in your browser and remained private at all times.</span>
        </div>
      </div>

      {/* Share System */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs">
        <ShareSystem
          toolName="PowerPoint to PDF Converter"
          toolUrl="https://www.snapfreetools.com/powerpoint-to-pdf"
        />
      </div>

      {/* Contextual Next Steps / Internal Links */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 text-left">
        <h4 className="text-base font-black text-slate-900">
          Next Steps with Your PDF Document
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/compress-pdf"
            className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group block"
          >
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 group-hover:text-emerald-700">
              <FileDown size={16} className="text-emerald-500" />
              <span>Compress PDF</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Reduce the file size of your exported presentation PDF for easy email sharing.
            </p>
          </Link>

          <Link
            href="/organize-pdf"
            className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group block"
          >
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 group-hover:text-emerald-700">
              <Sparkles size={16} className="text-blue-500" />
              <span>Organize PDF</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Reorder, rotate, or delete specific pages from your generated presentation PDF.
            </p>
          </Link>

          <Link
            href="/pdf-to-powerpoint"
            className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group block"
          >
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 group-hover:text-emerald-700">
              <Presentation size={16} className="text-amber-500" />
              <span>PDF to PowerPoint</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Need to turn a PDF back into an editable presentation? Try PDF to PowerPoint.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
