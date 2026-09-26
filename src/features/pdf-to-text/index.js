"use client";

import React, { useState, useRef } from "react";
import { 
  FileText, UploadCloud, Loader2, RefreshCw, AlertCircle, 
  Shield, Zap, CheckCircle2, ArrowRight, Sparkles, XCircle
} from "lucide-react";
import Link from "next/link";
import ToolLayout from "@/layouts/tool-layout";
import TextResultView from "./components/TextResultView";
import EducationalContent, { FAQS_DATA } from "./content/educationalContent";
import { extractPdfText, extractPdfTextWithOcr, cancelCurrentOcr } from "./utils/extractPdfText";

export default function PDFToTextFeature({ faqs = FAQS_DATA }) {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, percent: 0 });
  const [ocrProgress, setOcrProgress] = useState({ message: "", current: 0, total: 0, percent: 0 });
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  // Maximum file size: 50MB
  const MAX_FILE_SIZE = 50 * 1024 * 1024;

  const validateAndProcessFile = async (selectedFile) => {
    setFileError(null);
    setResult(null);

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endsWith(".pdf")) {
      setFileError("Invalid file format. Please select a valid PDF document (.pdf).");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError("File size exceeds 50MB. Please select a smaller PDF file.");
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);
    setProgress({ current: 0, total: 0, percent: 5 });

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const extractedResult = await extractPdfText(arrayBuffer, {
        onProgress: (prog) => {
          setProgress(prog);
        }
      });

      setResult(extractedResult);
    } catch (err) {
      console.error("PDF to Text Error:", err);
      if (err.code === "PASSWORD_PROTECTED" || err.message === "PASSWORD_PROTECTED") {
        setFileError(
          <span>
            This PDF document is password-protected or encrypted. Please unlock it using our free{" "}
            <Link href="/unlock-pdf" className="underline font-bold text-amber-700 hover:text-amber-900">
              Unlock PDF Tool
            </Link>{" "}
            before extracting text.
          </span>
        );
      } else if (err.code === "INVALID_OR_CORRUPT_PDF") {
        setFileError("Unable to read PDF file. The document may be corrupted or damaged.");
      } else {
        setFileError(err.message || "An unexpected error occurred while processing the PDF file.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartOcr = async () => {
    if (!file) return;

    setFileError(null);
    setIsOcrProcessing(true);
    setOcrProgress({ message: "Preparing OCR engine...", current: 0, total: result?.pageCount || 1, percent: 5 });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const ocrResult = await extractPdfTextWithOcr(arrayBuffer, {
        onProgress: (prog) => {
          setOcrProgress(prog);
        }
      });

      setResult(ocrResult);
    } catch (err) {
      console.error("PDF to Text OCR Error:", err);
      const errMsg = err?.message || "";
      if (errMsg.includes("cancelled") || errMsg.includes("CANCEL")) {
        console.log("OCR operation cancelled by user.");
      } else if (err.code === "NO_OCR_TEXT_FOUND" || errMsg.includes("NO_OCR_TEXT_FOUND")) {
        setFileError(
          "OCR completed, but no readable text was found in this document. The scanned image may be blank, unreadable, or low resolution. Try uploading a clearer scan."
        );
      } else if (err.code === "PASSWORD_PROTECTED" || errMsg.includes("PASSWORD_PROTECTED")) {
        setFileError(
          <span>
            This PDF document is password-protected. Please unlock it using our free{" "}
            <Link href="/unlock-pdf" className="underline font-bold text-amber-700 hover:text-amber-900">
              Unlock PDF Tool
            </Link>{" "}
            before performing OCR.
          </span>
        );
      } else {
        setFileError(err.message || "An error occurred during OCR text recognition. Please try again with a clearer file.");
      }
    } finally {
      setIsOcrProcessing(false);
    }
  };

  const handleCancelOcr = async () => {
    try {
      await cancelCurrentOcr();
    } catch (err) {
      console.warn("Error cancelling OCR:", err);
    } finally {
      setIsOcrProcessing(false);
      setOcrProgress({ message: "", current: 0, total: 0, percent: 0 });
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    validateAndProcessFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    validateAndProcessFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    if (isOcrProcessing) {
      cancelCurrentOcr();
    }
    setFile(null);
    setFileError(null);
    setIsProcessing(false);
    setIsOcrProcessing(false);
    setProgress({ current: 0, total: 0, percent: 0 });
    setOcrProgress({ message: "", current: 0, total: 0, percent: 0 });
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Construct safe dynamic share summary (no file contents or personal data)
  const shareResultSummary = result ? {
    summary: `Extracted text from a PDF document containing ${result.pageCount} page${result.pageCount === 1 ? '' : 's'} and ${result.wordCount.toLocaleString()} words${result.isOcrResult ? ' (via Free In-Browser OCR)' : ''}.`
  } : null;

  return (
    <ToolLayout
      title="PDF to Text Converter"
      description="Extract plain text (.txt) from native & scanned PDF files instantly inside your browser. Free in-browser OCR, private, zero cloud uploads."
      currentSlug="pdf-to-text"
      result={shareResultSummary}
      seoContent={<EducationalContent faqs={faqs} />}
    >
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
            <Zap size={14} className="text-amber-500 fill-amber-500" />
            100% In-Browser Privacy • Free OCR Included
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            PDF to Text Converter
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Extract raw text from digital and scanned PDF documents instantly. Copy to clipboard or download as a clean .TXT file inside your browser.
          </p>
        </div>

        {/* Upload / Processing / Result Container */}
        <div className="max-w-3xl mx-auto">
          {fileError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-xs text-red-800 leading-relaxed">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">{fileError}</div>
              <button
                onClick={() => setFileError(null)}
                className="text-red-500 hover:text-red-700 font-bold ml-2"
              >
                ×
              </button>
            </div>
          )}

          {/* STATE 1: Upload Dropzone (When idle, not OCR running, and no result) */}
          {!isProcessing && !isOcrProcessing && !result && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={triggerFileSelect}
              className="border-2 border-dashed border-slate-300 hover:border-amber-500 bg-white hover:bg-amber-50/20 transition-all rounded-3xl p-8 sm:p-12 text-center cursor-pointer space-y-4 group shadow-sm hover:shadow-md"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-16 h-16 rounded-2xl bg-slate-100 group-hover:bg-amber-100 text-slate-500 group-hover:text-amber-600 flex items-center justify-center mx-auto transition-colors">
                <UploadCloud size={32} />
              </div>

              <div className="space-y-1">
                <p className="text-base font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                  Drop your PDF file here or <span className="text-amber-600 underline">Browse</span>
                </p>
                <p className="text-xs text-slate-400 font-medium">
                  Supports digital & scanned PDF files up to 50MB
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500 pt-2">
                <span className="flex items-center gap-1.5">
                  <Shield size={14} className="text-emerald-500" /> Client-Side Execution
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" /> Free Browser OCR
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-500" /> Free & Unlimited
                </span>
              </div>
            </div>
          )}

          {/* STATE 2A: Native Text Extraction Progress */}
          {isProcessing && (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto animate-spin">
                <Loader2 size={28} />
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-800 text-base">Extracting Text from PDF...</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Processing page {progress.current || 1} of {progress.total || "document"} ({progress.percent || 0}%)
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md mx-auto bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-amber-500 h-full transition-all duration-200 rounded-full"
                  style={{ width: `${Math.max(5, progress.percent || 0)}%` }}
                />
              </div>

              <p className="text-xs text-slate-400">Please keep this window open while processing completed in browser memory.</p>
            </div>
          )}

          {/* STATE 2B: Free In-Browser OCR Progress */}
          {isOcrProcessing && (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto animate-spin">
                <Loader2 size={28} />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-extrabold">
                  <Sparkles size={14} className="text-amber-600" />
                  Free In-Browser OCR Engine
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">Recognizing Text from Scanned PDF...</h3>
                <p className="text-xs text-amber-900 font-medium">
                  {ocrProgress.message || `Processing page ${ocrProgress.current || 1} of ${ocrProgress.total || 1}...`}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md mx-auto bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${Math.max(5, ocrProgress.percent || 0)}%` }}
                />
              </div>

              <div className="pt-2 flex flex-col items-center gap-3">
                <button
                  onClick={handleCancelOcr}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 transition-colors cursor-pointer"
                >
                  <XCircle size={16} />
                  Cancel OCR
                </button>
                <p className="text-xs text-slate-400">100% Client-side execution using local Tesseract.js WASM assets. Zero uploads.</p>
              </div>
            </div>
          )}

          {/* STATE 3: Extracted Text Result */}
          {!isProcessing && !isOcrProcessing && result && (
            <TextResultView
              result={result}
              fileName={file?.name}
              onReset={handleReset}
              onStartOcr={handleStartOcr}
              isOcrProcessing={isOcrProcessing}
            />
          )}
        </div>
      </div>
    </ToolLayout>
  );
}

