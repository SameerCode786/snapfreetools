"use client";

import React, { useState, useEffect } from "react";
import ToolLayout from "@/layouts/tool-layout";
import UploadZone from "./components/UploadZone";
import PdfFileInfo from "./components/PdfFileInfo";
import PasswordForm from "./components/PasswordForm";
import UnlockProgress from "./components/UnlockProgress";
import UnlockResults from "./components/UnlockResults";
import { inspectPdfForUnlock, executePdfUnlock } from "./utils/pdfUnlockEngine";
import { UNLOCK_PDF_EDUCATIONAL_CONTENT } from "./content/educationalContent";
import { UNLOCK_PDF_FAQS } from "./content/faqs";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import { Lock, Unlock, AlertCircle, Shield, Zap, Award, CheckCircle2 } from "lucide-react";

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

      if (!parsedInfo.isProtected) {
        setError("This PDF is already unlocked.");
      }
    } catch (err) {
      console.error("PDF Inspection Error:", err);
      const errMsg = err.message || (typeof err === "string" ? err : "We couldn't process this PDF. The file may be corrupted or invalid.");
      setError(errMsg);
      setStatus("idle");
    }
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

  // Execute PDF Unlock
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
      const errMsg = err.message || (typeof err === "string" ? err : "We couldn't unlock this PDF. Please verify the password and try again.");
      setError(errMsg);
      setStatus("file_loaded");
    }
  };

  return (
    <ToolLayout
      title="Unlock PDF Online"
      description="Remove PDF password protection and restrictions online free. Decrypt your documents securely inside your browser."
      currentSlug="unlock-pdf"
      result={status === "completed" && unlockResult ? {
        summary: `Successfully removed password protection from "${unlockResult.originalName}" (${unlockResult.pageCount} pages).`
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
            Unlock PDF Online
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Remove password security and editing restrictions from PDF documents. Fast, secure, and 100% browser-based.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 pt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
              <Zap size={13} /> Free to Use
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100">
              <Shield size={13} /> 100% Private (No Uploads)
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100">
              <Award size={13} /> Genuine Unencrypted Output
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
            <p className="text-sm font-extrabold text-slate-800">Reading PDF File...</p>
          </div>
        )}

        {/* State 2: File Loaded (PdfFileInfo + PasswordForm) */}
        {status === "file_loaded" && fileInfo && (
          <div className="space-y-8">
            <PdfFileInfo fileInfo={fileInfo} onRemove={handleRemoveFile} />
            {fileInfo.isProtected ? (
              <PasswordForm onUnlock={handleUnlock} error={null} />
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-4 max-w-3xl mx-auto shadow-xs">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">This PDF is Already Unlocked</h3>
                <p className="text-xs text-slate-500 font-semibold max-w-md mx-auto">
                  The uploaded PDF document does not contain password encryption. You can view, print, or edit it directly without unlocking.
                </p>
                <button
                  onClick={handleRemoveFile}
                  className="mt-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                >
                  Select Another PDF
                </button>
              </div>
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
