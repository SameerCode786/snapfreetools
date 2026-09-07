"use client";

import React, { useState, useEffect } from "react";
import ToolLayout from "@/layouts/tool-layout";
import ProtectPdfUploadZone from "./components/ProtectPdfUploadZone";
import PasswordForm from "./components/PasswordForm";
import SecurityOptionsCard from "./components/SecurityOptionsCard";
import ProtectProgress from "./components/ProtectProgress";
import ProtectResult from "./components/ProtectResult";
import { inspectPdfForProtection, executePdfProtection, formatFileSize } from "./utils/protectPdfEngine.js";
import { PROTECT_PDF_EDUCATIONAL_CONTENT } from "./content/educationalContent.js";
import { PROTECT_PDF_FAQS } from "./content/faqs.js";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import { Lock, Shield, Zap, Award, AlertCircle, FileText, Trash2 } from "lucide-react";

export default function ProtectPDFFeature({ faqs = PROTECT_PDF_FAQS }) {
  const [fileInfo, setFileInfo] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, loading_file, file_loaded, protecting, completed
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [keyLength, setKeyLength] = useState("256");
  const [permissions, setPermissions] = useState({
    printing: false,
    copying: false,
    modifying: false,
    annotating: false
  });
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const [progressInfo, setProgressInfo] = useState({ step: "Encrypting PDF...", percent: 0 });
  const [protectResult, setProtectResult] = useState(null);
  const [error, setError] = useState(null);

  // Clean up Object URLs on unmount or reset
  useEffect(() => {
    return () => {
      if (protectResult && protectResult.url) {
        URL.revokeObjectURL(protectResult.url);
      }
    };
  }, [protectResult]);

  // Handle uploaded PDF selection
  const handleFileSelected = async (file) => {
    setError(null);
    setStatus("loading_file");

    try {
      const parsedInfo = await inspectPdfForProtection(file);
      setFileInfo(parsedInfo);
      setStatus("file_loaded");
    } catch (err) {
      console.error("PDF Inspection Error:", err);
      const errMsg = err.message || (typeof err === "string" ? err : "This PDF document appears to be corrupted or invalid. Please select another file.");
      setError(errMsg);
      setStatus("idle");
    }
  };

  // Remove file & reset state
  const handleRemoveFile = () => {
    if (protectResult && protectResult.url) {
      URL.revokeObjectURL(protectResult.url);
    }
    setFileInfo(null);
    setProtectResult(null);
    setPassword("");
    setConfirmPassword("");
    setOwnerPassword("");
    setError(null);
    setStatus("idle");
  };

  // Execute PDF Protection
  const handleProtect = async () => {
    if (!fileInfo) return;

    if (!password || !password.trim()) {
      setError("Please enter a password to protect your PDF.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify your password entry.");
      return;
    }

    setError(null);
    setStatus("protecting");
    setProgressInfo({ step: "Loading client-side PDF encryption engine...", percent: 20 });

    try {
      const result = await executePdfProtection({
        fileInfo,
        userPassword: password,
        confirmPassword,
        ownerPassword,
        keyLength,
        permissions,
        onProgress: (prog) => setProgressInfo(prog)
      });

      setProtectResult(result);
      setStatus("completed");
    } catch (err) {
      console.error("PDF Protection Execution Error:", err);
      const errMsg = err.message || (typeof err === "string" ? err : "Unable to protect this PDF document. Please try another file.");
      setError(errMsg);
      setStatus("file_loaded");
    }
  };

  return (
    <ToolLayout
      title="Protect PDF Online - Add Password & Encrypt PDF"
      description="Protect PDF files online free. Add strong AES-256 password protection and restrict permissions for printing, editing, and copying secure documents."
      currentSlug="protect-pdf"
      result={status === "completed" && protectResult ? {
        summary: `Successfully encrypted "${protectResult.originalName}" (${protectResult.pageCount} pages).`
      } : null}
      seoContent={
        <div className="space-y-16">
          {PROTECT_PDF_EDUCATIONAL_CONTENT}
          <FAQSection faqs={faqs} title="Frequently Asked Questions" />
        </div>
      }
    >
      <div id="protect-pdf-workspace" className="space-y-12">
        
        {/* Header Hero */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Protect PDF Security & Encrypt Online
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Add AES-256 password protection and restrict printing, editing, and copying limits. 100% private inside your browser.
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
              <Award size={13} /> Verified AES-256 Security
            </span>
          </div>
        </div>

        {/* Global Error Alert */}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-center gap-3 text-xs font-bold shadow-xs" role="alert">
            <AlertCircle size={20} className="shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* State 1: Idle (Upload Zone) */}
        {status === "idle" && (
          <div className="max-w-3xl mx-auto">
            <ProtectPdfUploadZone onFileSelected={handleFileSelected} />
          </div>
        )}

        {/* Loading File State Spinner */}
        {status === "loading_file" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto shadow-xs">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-extrabold text-slate-800">Reading PDF File Structure...</p>
          </div>
        )}

        {/* State 2: File Loaded */}
        {status === "file_loaded" && fileInfo && (
          <div className="space-y-8">
            
            {/* File Info Bar */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-3xl mx-auto">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                {fileInfo.firstPageThumbnail ? (
                  <div className="w-14 h-18 bg-slate-100 border border-slate-200 rounded-xl overflow-hidden shrink-0 shadow-xs flex items-center justify-center">
                    <img src={fileInfo.firstPageThumbnail} alt="PDF Thumbnail" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-14 h-18 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <FileText size={28} />
                  </div>
                )}
                <div className="min-w-0 flex-1 space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-sm sm:text-base truncate" title={fileInfo.name}>
                    {fileInfo.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                    <span>Size: <strong className="text-slate-700">{formatFileSize(fileInfo.size)}</strong></span>
                    {fileInfo.pageCount !== null && (
                      <>
                        <span>•</span>
                        <span>Pages: <strong className="text-slate-700">{fileInfo.pageCount}</strong></span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleRemoveFile}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
              >
                <Trash2 size={16} />
                <span>Remove</span>
              </button>
            </div>

            {/* Password Form */}
            <PasswordForm
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              onSubmit={handleProtect}
              error={null}
            />

            {/* Security & Permissions Settings Card */}
            <SecurityOptionsCard
              keyLength={keyLength}
              setKeyLength={setKeyLength}
              permissions={permissions}
              setPermissions={setPermissions}
              isAdvancedOpen={isAdvancedOpen}
              setIsAdvancedOpen={setIsAdvancedOpen}
            />

            {/* Submit Action Button */}
            <div className="max-w-3xl mx-auto">
              <button
                onClick={handleProtect}
                disabled={!password.trim() || password !== confirmPassword}
                className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-black py-4 px-8 rounded-2xl shadow-md shadow-amber-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base cursor-pointer disabled:opacity-50"
              >
                <Lock size={20} />
                <span>Protect PDF</span>
              </button>
            </div>
          </div>
        )}

        {/* State 3: Protecting Progress */}
        {status === "protecting" && (
          <ProtectProgress progressInfo={progressInfo} />
        )}

        {/* State 4: Completed Results */}
        {status === "completed" && protectResult && (
          <ProtectResult result={protectResult} onReset={handleRemoveFile} />
        )}

      </div>
    </ToolLayout>
  );
}
