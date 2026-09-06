"use client";

import React, { useState, useEffect } from "react";
import ToolLayout from "@/layouts/tool-layout";
import UploadZone from "./components/UploadZone";
import PdfFileInfo from "./components/PdfFileInfo";
import CompressionSettings from "./components/CompressionSettings";
import CompressProgress from "./components/CompressProgress";
import CompressResults from "./components/CompressResults";
import { parsePdfFileInfo, compressPdfFile } from "./utils/pdfCompressorEngine";
import { COMPRESS_PDF_EDUCATIONAL_CONTENT } from "./content/educationalContent";
import { COMPRESS_PDF_FAQS } from "./content/faqs";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import { FileDown, AlertCircle, Zap, Shield, Award, FileEdit } from "lucide-react";

export default function CompressPDFFeature({ faqs = COMPRESS_PDF_FAQS }) {
  const [fileInfo, setFileInfo] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState("balanced");
  const [status, setStatus] = useState("idle"); // idle, loading_file, file_loaded, compressing, completed
  const [progressInfo, setProgressInfo] = useState({ step: "Compressing PDF...", percent: 0 });
  const [compressionResult, setCompressionResult] = useState(null);
  const [error, setError] = useState(null);

  // Clean up Object URLs on unmount or reset
  useEffect(() => {
    return () => {
      if (compressionResult && compressionResult.url) {
        URL.revokeObjectURL(compressionResult.url);
      }
    };
  }, [compressionResult]);

  // Handle uploaded PDF file selection
  const handleFileSelected = async (file) => {
    setError(null);
    setStatus("loading_file");

    try {
      const parsedInfo = await parsePdfFileInfo(file);
      setFileInfo(parsedInfo);
      if (parsedInfo.smartRecommendation && parsedInfo.smartRecommendation.recommendedLevel) {
        setSelectedLevel(parsedInfo.smartRecommendation.recommendedLevel);
      }
      setStatus("file_loaded");
    } catch (err) {
      console.error("PDF Parsing Error:", err);
      setError(err.message || "We couldn't process this PDF. It may be encrypted or corrupted.");
      setStatus("idle");
    }
  };

  // Remove file & reset to upload state
  const handleRemoveFile = () => {
    if (compressionResult && compressionResult.url) {
      URL.revokeObjectURL(compressionResult.url);
    }
    setFileInfo(null);
    setCompressionResult(null);
    setError(null);
    setStatus("idle");
  };

  // Execute PDF Compression
  const handleCompress = async () => {
    if (!fileInfo) return;

    setError(null);
    setStatus("compressing");
    setProgressInfo({ step: "Reading PDF...", percent: 10 });

    try {
      const result = await compressPdfFile({
        fileInfo,
        level: selectedLevel,
        onProgress: (prog) => setProgressInfo(prog)
      });

      setCompressionResult(result);
      setStatus("completed");
    } catch (err) {
      console.error("Compression Error:", err);
      setError(err.message || "An unexpected error occurred during PDF compression.");
      setStatus("file_loaded");
    }
  };

  return (
    <ToolLayout
      title="Compress PDF Online"
      description="Reduce PDF document file size online free while maintaining optimal text and image quality."
      currentSlug="compress-pdf"
      result={status === "completed" && compressionResult ? {
        summary: compressionResult.isReduced 
          ? `Compressed PDF (${compressionResult.pageCount} pages) from ${compressionResult.formattedOriginalSize} to ${compressionResult.formattedCompressedSize} (${compressionResult.percentageSaved}% smaller).`
          : `PDF (${compressionResult.pageCount} pages, ${compressionResult.formattedOriginalSize}) is already optimized.`
      } : null}
      seoContent={
        <div className="space-y-16">
          {COMPRESS_PDF_EDUCATIONAL_CONTENT}
          <FAQSection faqs={faqs} title="Frequently Asked Questions" />
        </div>
      }
    >
      <div id="compress-pdf-workspace" className="space-y-12">
        
        {/* Header Hero */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Compress PDF Online
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Reduce PDF document file size while preserving text, vectors, and document layout. Fast, private, and 100% browser-based.
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
              <Award size={13} /> Text & Vectors Preserved
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

        {/* State 2: File Loaded (FileInfo + Settings Workspace) */}
        {status === "file_loaded" && fileInfo && (
          <div className="space-y-8">
            <PdfFileInfo fileInfo={fileInfo} onRemove={handleRemoveFile} />
            <CompressionSettings
              selectedLevel={selectedLevel}
              onSelectLevel={setSelectedLevel}
              onCompress={handleCompress}
              smartRecommendation={fileInfo.smartRecommendation}
            />
          </div>
        )}

        {/* State 3: Compressing Progress */}
        {status === "compressing" && (
          <CompressProgress progressInfo={progressInfo} />
        )}

        {/* State 4: Completed Results */}
        {status === "completed" && compressionResult && (
          <CompressResults result={compressionResult} onReset={handleRemoveFile} />
        )}

      </div>
    </ToolLayout>
  );
}
