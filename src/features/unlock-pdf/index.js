"use client";

import React, { useState, useEffect } from "react";
import ToolLayout from "@/layouts/tool-layout";
import UploadZone from "./components/UploadZone";
import PdfSecurityAnalysisCard from "./components/PdfSecurityAnalysisCard";
import PasswordForm from "./components/PasswordForm";
import UnlockProgress from "./components/UnlockProgress";
import UnlockResults from "./components/UnlockResults";
import { inspectPdfForUnlock, executePdfUnlock, executeRemoveRestrictions } from "./utils/pdfUnlockEngine";
import { UNLOCK_PDF_EDUCATIONAL_CONTENT } from "./content/educationalContent";
import { UNLOCK_PDF_FAQS } from "./content/faqs";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import { Lock, Unlock, AlertCircle, Shield, Zap, Award, CheckCircle2, Download, RefreshCw } from "lucide-react";

export default function UnlockPDFFeature({ faqs = UNLOCK_PDF_FAQS }) {
  const [fileInfo, setFileInfo] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, loading_file, file_loaded, unlocking, completed
  const [progressInfo, setProgressInfo] = useState({ step: "Unlocking PDF...", percent: 0 });
  const [unlockResult, setUnlockResult] = useState(null);
  const [error, setError] = useState(null);

  // Clean up Object URLs on unmount or reset
  useEffect(() => {
    return () => {
      if (unlockResult && unlockResult.url) {
        URL.revokeObjectURL(unlockResult.url);
      }
    };
  }, [unlockResult]);

  // Handle uploaded PDF file selection
  const handleFileSelected = async (file) => {
    setError(null);
    setStatus("loading_file");

    try {
      const parsedInfo = await inspectPdfForUnlock(file);
      setFileInfo(parsedInfo);
      setStatus("file_loaded");
    } catch (err) {
      console.error("PDF Inspection Error:", err);
      const errMsg = err.message || (typeof err === "string" ? err : "This PDF document appears to be corrupted or invalid. Please select another file.");
      setError(errMsg);
      setStatus("idle");
    }
  };

  // Direct download for already unlocked original PDF (Case 1)
  const handleDownloadOriginal = () => {
    if (!fileInfo || !fileInfo.rawFile) return;
    const url = URL.createObjectURL(fileInfo.rawFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileInfo.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  // Remove file & reset state
  const handleRemoveFile = () => {
    if (unlockResult && unlockResult.url) {
      URL.revokeObjectURL(unlockResult.url);
    }
    setFileInfo(null);
    setUnlockResult(null);
    setError(null);
    setStatus("idle");
  };

  // Execute PDF Unlock (Case 2 & 3)
  const handleUnlock = async (password) => {
    if (!fileInfo) return;

    setError(null);
    setStatus("unlocking");
    setProgressInfo({ step: "Verifying password credentials...", percent: 20 });

    try {
      const result = await executePdfUnlock({
        fileInfo,
        password,
        onProgress: (prog) => setProgressInfo(prog)
      });

      setUnlockResult(result);
      setStatus("completed");
    } catch (err) {
      console.error("PDF Unlock Error:", err);
      const errMsg = err.message || (typeof err === "string" ? err : "Incorrect password. Please check your password and try again.");
      setError(errMsg);
      setStatus("file_loaded");
    }
  };

  // Execute Remove Restrictions (Case 4)
  const handleRemoveRestrictions = async () => {
    if (!fileInfo) return;

    setError(null);
    setStatus("unlocking");
    setProgressInfo({ step: "Removing PDF restrictions...", percent: 30 });

    try {
      const result = await executeRemoveRestrictions({
        fileInfo,
        onProgress: (prog) => setProgressInfo(prog)
      });

      setUnlockResult(result);
      setStatus("completed");
    } catch (err) {
      console.error("Remove Restrictions Error:", err);
      const errMsg = err.message || (typeof err === "string" ? err : "Unable to remove restrictions from this PDF. Please try another file.");
      setError(errMsg);
      setStatus("file_loaded");
    }
  };

  return (
    <ToolLayout
      title="Unlock PDF Online"
      description="Remove PDF password protection and usage restrictions online free. Decrypt your documents securely inside your browser."
      currentSlug="unlock-pdf"
      result={status === "completed" && unlockResult ? {
        summary: `Successfully processed "${unlockResult.originalName}" (${unlockResult.pageCount} pages).`
      } : null}
      seoContent={
        <div className="space-y-16">
          {UNLOCK_PDF_EDUCATIONAL_CONTENT}
          <FAQSection faqs={faqs} title="Frequently Asked Questions" />
        </div>
      }
    >
      <div id="unlock-pdf-workspace" className="space-y-12">
        
        {/* Header Hero */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Unlock PDF Security & Analyzer
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Analyze PDF security, remove password protection, and strip printing restrictions. 100% private in your browser.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 pt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
              <Zap size={13} /> Free Browser Tool
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100">
              <Shield size={13} /> 100% Local (Zero Server Uploads)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100">
              <Award size={13} /> Verified Clean Output
            </span>
          </div>
        </div>

        {/* Error Alert Message */}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-xs" role="alert">
            <AlertCircle size={20} className="shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* State 1: Idle (Upload Zone) */}
        {status === "idle" && (
          <div className="max-w-3xl mx-auto">
            <UploadZone onFileSelected={handleFileSelected} />
          </div>
        )}

        {/* Loading File State Spinner */}
        {status === "loading_file" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto shadow-xs">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-extrabold text-slate-800">Analyzing PDF Security...</p>
          </div>
        )}

        {/* State 2: File Loaded */}
        {status === "file_loaded" && fileInfo && (
          <div className="space-y-8">
            {/* Security Analysis Card */}
            <PdfSecurityAnalysisCard fileInfo={fileInfo} />

            {/* Case 1: Already Unlocked PDF */}
            {!fileInfo.isProtected && !fileInfo.hasRestrictions && (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 text-center space-y-6 max-w-3xl mx-auto shadow-xs">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-emerald-100">
                  <CheckCircle2 size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    This PDF does not have password protection
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto leading-relaxed">
                    The uploaded document has no password encryption or usage restrictions. You can download the original file directly or choose another PDF.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2 max-w-md mx-auto">
                  <button
                    onClick={handleDownloadOriginal}
                    className="bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold py-3.5 px-6 rounded-2xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-xs cursor-pointer flex-1"
                  >
                    <Download size={16} />
                    <span>Download Original PDF</span>
                  </button>
                  <button
                    onClick={handleRemoveFile}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-6 rounded-2xl transition-all text-xs cursor-pointer shadow-2xs"
                  >
                    Select Another PDF
                  </button>
                </div>
              </div>
            )}

            {/* Case 4: Permission Restrictions Only */}
            {!fileInfo.isProtected && fileInfo.hasRestrictions && (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 text-center space-y-6 max-w-3xl mx-auto shadow-xs">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-blue-100">
                  <Shield size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    This PDF has usage restrictions such as printing or copying limits
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto leading-relaxed">
                    This document opens without an opening password, but contains owner restrictions. Click below to strip all restrictions instantly.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2 max-w-md mx-auto">
                  <button
                    onClick={handleRemoveRestrictions}
                    className="bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-black py-4 px-8 rounded-2xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer flex-1"
                  >
                    <Unlock size={18} />
                    <span>Remove Restrictions</span>
                  </button>
                  <button
                    onClick={handleRemoveFile}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-6 rounded-2xl transition-all text-xs cursor-pointer shadow-2xs"
                  >
                    Select Another PDF
                  </button>
                </div>
              </div>
            )}

            {/* Case 2: Opening Password Required */}
            {fileInfo.isProtected && (
              <PasswordForm onUnlock={handleUnlock} error={error} />
            )}
          </div>
        )}

        {/* State 3: Unlocking Progress */}
        {status === "unlocking" && (
          <UnlockProgress progressInfo={progressInfo} />
        )}

        {/* State 4: Completed Results */}
        {status === "completed" && unlockResult && (
          <UnlockResults result={unlockResult} onReset={handleRemoveFile} />
        )}

      </div>
    </ToolLayout>
  );
}

