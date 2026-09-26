"use client";

import React, { useState } from "react";
import { 
  Copy, Check, Download, RefreshCw, FileText, 
  Layers, AlertTriangle, Sparkles, BookOpen, Shield
} from "lucide-react";

export default function TextResultView({
  result,
  fileName,
  onReset,
  onStartOcr,
  isOcrProcessing
}) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("full"); // "full" or "page"
  const [selectedPage, setSelectedPage] = useState(1);

  if (!result) return null;

  const { 
    pages, fullText, pageCount, wordCount, characterCount, 
    isScannedPDF, isOcrResult, avgConfidence = 0, isLowConfidence = false 
  } = result;

  const handleCopy = async () => {
    try {
      const textToCopy = activeTab === "page" 
        ? (pages.find(p => p.pageNumber === selectedPage)?.text || "") 
        : fullText;
      
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback copy logic if clipboard API fails
      const textarea = document.createElement("textarea");
      textarea.value = fullText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const baseName = fileName ? fileName.replace(/\.[^/.]+$/, "") : "pdf-extracted-text";
    const downloadFileName = `${baseName}-text.txt`;
    const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const currentPageText = pages.find(p => p.pageNumber === selectedPage)?.text || "";

  return (
    <div className="w-full space-y-6 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
      {/* Header & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 font-bold">
              <FileText size={18} />
            </span>
            <h3 className="text-xl font-extrabold text-slate-900">Extracted Text Result</h3>
          </div>
          <p className="text-xs text-slate-500 font-medium truncate max-w-md">
            Source File: <span className="font-semibold text-slate-700">{fileName || "Document.pdf"}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            {copied ? "Copied to Clipboard!" : "Copy Text"}
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            <Download size={16} />
            Download .TXT
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
          >
            <RefreshCw size={16} />
            Clear
          </button>
        </div>
      </div>

      {/* Scanned Image / Empty Text Alert Banner with OCR Option */}
      {isScannedPDF && (
        <div className="flex items-start gap-3.5 p-5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs leading-relaxed">
          <AlertTriangle size={22} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-3 flex-1">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-amber-950">
                No selectable text found. This may be a scanned PDF.
              </h4>
              <p className="text-amber-800">
                Standard PDF text extraction parses digital character codes. Scanned documents and image PDFs require Optical Character Recognition (OCR) to convert image letters into editable text.
              </p>
            </div>

            {onStartOcr && (
              <div className="pt-1 flex flex-wrap items-center gap-3">
                <button
                  onClick={onStartOcr}
                  disabled={isOcrProcessing}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-95 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <Sparkles size={16} />
                  Extract Text with Free OCR
                </button>
                <span className="text-[11px] text-amber-800 font-medium flex items-center gap-1">
                  <Shield size={13} className="text-emerald-600" />
                  100% In-Browser Engine • Zero Server Uploads
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OCR Result Badges & Quality Warnings */}
      {isOcrResult && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center p-1 rounded-lg bg-amber-100 text-amber-700 font-bold">
                <Sparkles size={16} />
              </span>
              <span className="font-bold text-amber-950">
                Extracted via Free In-Browser OCR
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-full font-extrabold text-[11px] ${
                isLowConfidence 
                  ? "bg-amber-200 text-amber-900 border border-amber-300" 
                  : "bg-emerald-100 text-emerald-800 border border-emerald-200"
              }`}>
                Average OCR Confidence: {avgConfidence}%
              </span>
            </div>
          </div>

          {isLowConfidence ? (
            <div className="flex items-start gap-2.5 p-3.5 bg-amber-100/80 border border-amber-300 rounded-2xl text-xs text-amber-950">
              <AlertTriangle size={18} className="text-amber-700 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Low Confidence Warning ({avgConfidence}%):</strong> OCR accuracy depends on scan quality and image resolution. Please review extracted text for potential typos.
              </p>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 font-medium italic">
              Notice: OCR accuracy depends on scan clarity and document resolution. All recognition executed locally in browser memory.
            </p>
          )}
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pages</p>
          <p className="text-xl sm:text-2xl font-black text-slate-800 mt-1">{pageCount}</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Words</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">{wordCount.toLocaleString()}</p>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Characters</p>
          <p className="text-xl sm:text-2xl font-black text-amber-600 mt-1">{characterCount.toLocaleString()}</p>
        </div>
      </div>

      {/* View Toggle Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("full")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "full" 
                ? "bg-amber-100 text-amber-900 border border-amber-300" 
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BookOpen size={14} /> Full Document
          </button>
          
          <button
            onClick={() => setActiveTab("page")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "page" 
                ? "bg-amber-100 text-amber-900 border border-amber-300" 
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Layers size={14} /> Page-by-Page
          </button>
        </div>

        {/* Page Selector dropdown when in page mode */}
        {activeTab === "page" && pageCount > 1 && (
          <div className="flex items-center gap-2">
            <label htmlFor="page-select" className="text-xs font-semibold text-slate-600">
              Page:
            </label>
            <select
              id="page-select"
              value={selectedPage}
              onChange={(e) => setSelectedPage(Number(e.target.value))}
              className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-2 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {pages.map((p) => (
                <option key={p.pageNumber} value={p.pageNumber}>
                  Page {p.pageNumber}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Text Area Preview / Editor */}
      <div className="relative">
        <textarea
          readOnly
          value={activeTab === "full" ? fullText : currentPageText}
          placeholder="No text extracted..."
          rows={14}
          className="w-full font-mono text-xs sm:text-sm bg-slate-900 text-slate-100 p-4 sm:p-5 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50 leading-relaxed resize-y selection:bg-amber-500 selection:text-slate-900"
        />
      </div>
    </div>
  );
}

