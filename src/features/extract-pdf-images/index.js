"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { AlertCircle, Lock, RefreshCw, FileImage } from "lucide-react";
import ToolLayout from "@/layouts/tool-layout";
import UploadZone from "./components/UploadZone";
import ScanningProgress from "./components/ScanningProgress";
import ResultsGrid from "./components/ResultsGrid";
import EDUCATIONAL_CONTENT from "./content/educationalContent";
import {
  extractPdfImages,
  PdfExtractionError,
} from "./engine/pdfImageExtractor";

export default function ExtractPdfImagesFeature() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | scanning | success | error
  const [progressInfo, setProgressInfo] = useState({
    currentPage: 0,
    totalPages: 0,
    imagesFound: 0,
    phase: "preparing",
  });
  const [result, setResult] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  const abortControllerRef = useRef(null);

  // Clean up references on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleFileSelect = async (selectedFile, options = {}) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setErrorInfo(null);
    setResult(null);
    setStatus("scanning");
    setProgressInfo({
      currentPage: 0,
      totalPages: 0,
      imagesFound: 0,
      phase: "preparing",
    });

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const extractionResult = await extractPdfImages(selectedFile, {
        signal: controller.signal,
        pageRange: options.pageRange || "all",
        onProgress: (prog) => {
          setProgressInfo(prog);
        },
      });

      setResult(extractionResult);
      setStatus("success");
    } catch (err) {
      if (err.code === "CANCELLED" || err.message?.includes("cancelled")) {
        // Return safely to idle state on user cancellation
        handleReset();
        return;
      }

      console.error("PDF Image Extraction error:", err);
      setStatus("error");

      if (err.code === "PASSWORD_PROTECTED") {
        setErrorInfo({
          type: "PASSWORD_PROTECTED",
          title: "Password Protected PDF",
          message:
            "This PDF document is password-protected. Please unlock the PDF file before extracting images.",
          showUnlockLink: true,
        });
      } else if (err.code === "CORRUPTED_PDF") {
        setErrorInfo({
          type: "CORRUPTED_PDF",
          title: "Corrupted PDF Document",
          message:
            "Unable to read PDF structure. The file may be corrupted or invalid.",
        });
      } else {
        setErrorInfo({
          type: "UNKNOWN",
          title: "Extraction Failed",
          message:
            err.message ||
            "An unexpected error occurred while processing the PDF file. Please try again.",
        });
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    handleReset();
  };

  const handleReset = () => {
    setFile(null);
    setStatus("idle");
    setResult(null);
    setErrorInfo(null);
    setProgressInfo({
      currentPage: 0,
      totalPages: 0,
      imagesFound: 0,
      phase: "preparing",
    });
  };

  return (
    <ToolLayout
      title="Extract PDF Images"
      description="Extract embedded images, photos, and graphics from PDF documents instantly in your browser."
      currentSlug="extract-pdf-images"
      seoContent={<EDUCATIONAL_CONTENT />}
    >
      <div className="w-full space-y-8">
        {/* State 1: Upload Zone (Idle) */}
        {status === "idle" && (
          <UploadZone
            onFileSelect={handleFileSelect}
            onError={(msg) => {
              if (msg) {
                setStatus("error");
                setErrorInfo({
                  type: "VALIDATION",
                  title: "Invalid File",
                  message: msg,
                });
              } else {
                setErrorInfo(null);
              }
            }}
          />
        )}

        {/* State 2: Scanning Progress Bar */}
        {status === "scanning" && (
          <ScanningProgress
            progressInfo={progressInfo}
            filename={file?.name || "PDF Document"}
            onCancel={handleCancel}
          />
        )}

        {/* State 3: Results Grid */}
        {status === "success" && result && (
          <ResultsGrid
            result={result}
            file={file}
            onReset={handleReset}
          />
        )}

        {/* State 4: Error Display Banner */}
        {status === "error" && errorInfo && (
          <div className="w-full max-w-3xl mx-auto bg-white border border-red-200 rounded-3xl p-8 text-center space-y-6 shadow-xs animate-fade">
            <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto text-red-500 shadow-inner">
              {errorInfo.type === "PASSWORD_PROTECTED" ? (
                <Lock size={26} />
              ) : (
                <AlertCircle size={26} />
              )}
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="font-extrabold text-slate-800 text-lg">
                {errorInfo.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {errorInfo.message}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {errorInfo.showUnlockLink && (
                <Link
                  href="/unlock-pdf"
                  className="py-3 px-6 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all w-full sm:w-auto text-center"
                >
                  Unlock PDF First
                </Link>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="py-3 px-6 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 w-full sm:w-auto"
              >
                <RefreshCw size={14} /> Try Another PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
