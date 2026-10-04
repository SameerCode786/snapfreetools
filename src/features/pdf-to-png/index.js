"use client";

import React, { useState, useEffect } from "react";
import ToolLayout from "@/layouts/tool-layout";

import UploadState from "./components/UploadState.js";
import Workspace from "./components/Workspace.js";
import ProcessingState from "./components/ProcessingState.js";
import SuccessState from "./components/SuccessState.js";

import {
  parsePdfMetadata,
  renderAllThumbnailsBatch,
  convertPdfToPngBatch
} from "./utils/pdfToPngEngine.js";

import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import PdfToPngEducationalContent from "./content/educationalContent.js";
import { PDF_TO_PNG_FAQS } from "./content/faqs.js";

export default function PdfToPngFeature({ faqs = PDF_TO_PNG_FAQS }) {
  // Main state: 'upload' | 'workspace' | 'processing' | 'success'
  const [stage, setStage] = useState("upload");
  const [pdfData, setPdfData] = useState(null);
  const [fileError, setFileError] = useState(null);

  // Thumbnail previews state
  const [thumbnails, setThumbnails] = useState([]);
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);

  // Conversion Progress & Result State
  const [progress, setProgress] = useState({ current: 0, total: 0, stage: "" });
  const [result, setResult] = useState(null);

  // Clean object URLs on unmount or reset
  const cleanupResults = () => {
    if (result) {
      if (result.zipDownloadUrl) {
        try {
          URL.revokeObjectURL(result.zipDownloadUrl);
        } catch (e) {}
      }
      if (Array.isArray(result.images)) {
        result.images.forEach((img) => {
          if (img.objectUrl) {
            try {
              URL.revokeObjectURL(img.objectUrl);
            } catch (e) {}
          }
        });
      }
    }
  };

  useEffect(() => {
    return () => {
      cleanupResults();
    };
  }, [result]);

  // Handle uploaded PDF selection
  const handleFileSelect = async (rawFile) => {
    setFileError(null);

    try {
      const parsed = await parsePdfMetadata(rawFile);
      if (parsed.pageCount === 0) {
        setFileError("This PDF document appears to be empty or contains 0 pages.");
        return;
      }

      setPdfData({
        ...parsed,
        rawFile
      });
      setStage("workspace");

      // Load visual thumbnails asynchronously
      setIsLoadingThumbnails(true);
      try {
        const thumbs = await renderAllThumbnailsBatch(rawFile, 0.35);
        setThumbnails(thumbs);
      } catch (err) {
        console.warn("Failed to generate all page thumbnails:", err);
      } finally {
        setIsLoadingThumbnails(false);
      }
    } catch (err) {
      console.error("PDF Parsing Error:", err);
      if (err.name === "PasswordException" || (err.message && err.message.toLowerCase().includes("password"))) {
        setFileError("This PDF is password-protected. Please unlock it using our Unlock PDF tool first.");
      } else {
        setFileError("Could not read PDF. The file may be corrupted or use an unsupported format.");
      }
    }
  };

  // Start conversion
  const handleStartConversion = async (settings) => {
    if (!pdfData || !pdfData.rawFile) return;

    setStage("processing");
    setProgress({ current: 0, total: pdfData.pageCount, stage: "Preparing PDF pages..." });

    try {
      const conversionResult = await convertPdfToPngBatch({
        file: pdfData,
        settings,
        onProgress: (prog) => {
          setProgress(prog);
        }
      });

      setResult(conversionResult);
      setStage("success");
    } catch (err) {
      console.error("PDF to PNG Conversion Error:", err);
      setFileError(err.message || "Failed to convert PDF pages to PNG. Please try a lower DPI or fewer pages.");
      setStage("upload");
    }
  };

  // Reset tool state
  const handleReset = () => {
    cleanupResults();
    setPdfData(null);
    setThumbnails([]);
    setResult(null);
    setFileError(null);
    setStage("upload");
  };

  return (
    <ToolLayout
      title="PDF to PNG Converter — Convert PDF Pages to PNG Online"
      description="Convert PDF pages into high-quality PNG images online for free. Convert selected or all PDF pages directly in your browser with private client-side processing."
    >
      <div className="space-y-12">
        {/* Main Interactive Tool Tool Area */}
        <section className="min-h-[420px] flex flex-col justify-center">
          {stage === "upload" && (
            <UploadState
              onFileSelected={handleFileSelect}
              error={fileError}
            />
          )}

          {stage === "workspace" && pdfData && (
            <Workspace
              pdfData={pdfData}
              thumbnails={thumbnails}
              isLoadingThumbnails={isLoadingThumbnails}
              onStartConversion={handleStartConversion}
              onReset={handleReset}
            />
          )}

          {stage === "processing" && (
            <ProcessingState progress={progress} />
          )}

          {stage === "success" && result && (
            <SuccessState
              result={result}
              onReset={handleReset}
            />
          )}
        </section>

        {/* Educational Content Section */}
        <PdfToPngEducationalContent />

        {/* FAQ Section */}
        <FAQSection faqs={faqs} />
      </div>
    </ToolLayout>
  );
}
