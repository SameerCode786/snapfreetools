"use client";

import React, { useState, useEffect } from "react";
import ToolLayout from "@/layouts/tool-layout";

import UploadState from "./components/UploadState.js";
import Workspace from "./components/Workspace.js";
import ProcessingState from "./components/ProcessingState.js";
import SuccessState from "./components/SuccessState.js";

import {
  inspectPdf,
  resizePdf,
  sanitizeResizedFilename
} from "./utils/pdfResizeEngine.js";

import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import ResizePdfEducationalContent from "./content/educationalContent.js";
import { RESIZE_PDF_FAQS } from "./content/faqs.js";

export default function ResizePdfFeature({ faqs = RESIZE_PDF_FAQS }) {
  // Step state machine: 'upload' | 'workspace' | 'processing' | 'success'
  const [stage, setStage] = useState("upload");
  const [pdfData, setPdfData] = useState(null);
  const [fileError, setFileError] = useState(null);

  // Progress & Execution State
  const [progress, setProgress] = useState({ current: 0, total: 0, stage: "" });
  const [result, setResult] = useState(null);

  // Clean object URL on reset or unmount
  const cleanupResult = () => {
    if (result && result.downloadUrl) {
      try {
        URL.revokeObjectURL(result.downloadUrl);
      } catch (e) {}
    }
  };

  useEffect(() => {
    return () => {
      cleanupResult();
    };
  }, [result]);

  // Handle PDF file selection
  const handleFileSelect = async (rawFile) => {
    setFileError(null);

    try {
      const parsed = await inspectPdf(rawFile);
      if (parsed.pageCount === 0) {
        setFileError("This PDF document appears to be empty or contains 0 pages.");
        return;
      }

      setPdfData({
        ...parsed,
        name: rawFile.name,
        size: rawFile.size,
        rawFile
      });
      setStage("workspace");
    } catch (err) {
      console.error("PDF Parsing Error:", err);
      if (err.name === "PasswordException" || (err.message && err.message.toLowerCase().includes("password"))) {
        setFileError("This PDF is password-protected. Please unlock it using our Unlock PDF tool first.");
      } else {
        setFileError("Could not read PDF. The file may be corrupted or use an unsupported structure.");
      }
    }
  };

  // Execute PDF Resizing
  const handleStartResize = async (settings) => {
    if (!pdfData || !pdfData.rawFile) return;

    setStage("processing");
    setProgress({ current: 0, total: pdfData.pageCount, stage: "Preparing PDF transformation..." });

    try {
      const resizeOutput = await resizePdf({
        fileOrBuffer: pdfData.rawFile,
        targetWidthPt: settings.targetWidthPt,
        targetHeightPt: settings.targetHeightPt,
        mode: settings.mode,
        pageRange: settings.pageRange,
        onProgress: (prog) => {
          setProgress(prog);
        }
      });

      const resizedBlob = new Blob([resizeOutput.pdfBytes], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(resizedBlob);
      const filename = sanitizeResizedFilename(pdfData.name);

      setResult({
        ...resizeOutput,
        downloadUrl,
        filename
      });
      setStage("success");
    } catch (err) {
      console.error("PDF Resizing Error:", err);
      setFileError(err.message || "Failed to resize PDF pages. Please check dimensions and try again.");
      setStage("upload");
    }
  };

  // Reset tool
  const handleReset = () => {
    cleanupResult();
    setPdfData(null);
    setResult(null);
    setFileError(null);
    setStage("upload");
  };

  return (
    <ToolLayout
      title="Resize PDF Pages — Change PDF Page Size Online"
      description="Resize PDF pages to standard paper sizes (A4, Letter, A3, Legal) or custom dimensions online for free directly in your browser with 100% private processing."
    >
      <div className="space-y-12">
        {/* Main Tool Feature Area */}
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
              onStartResize={handleStartResize}
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
        <ResizePdfEducationalContent />

        {/* FAQ Section */}
        <FAQSection faqs={faqs} />
      </div>
    </ToolLayout>
  );
}
