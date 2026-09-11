"use client";

import React, { useState } from "react";
import ToolLayout from "@/layouts/tool-layout";

import UploadState from "./components/UploadState";
import WatermarkWorkspace from "./components/WatermarkWorkspace";
import ProcessingState from "./components/ProcessingState";
import WatermarkSuccess from "./components/WatermarkSuccess";

import {
  parsePdfMetadata,
  executePdfWatermark
} from "./utils/watermarkPdfEngine";

import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import WatermarkPdfEducationalContent from "./content/educationalContent";
import { WATERMARK_PDF_FAQS } from "./content/faqs";

export default function WatermarkPDFFeature({ faqs = WATERMARK_PDF_FAQS }) {
  // --- CORE STAGES ---
  const [stage, setStage] = useState("upload"); // 'upload' | 'workspace' | 'processing' | 'success'
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  // --- EXECUTION STATES ---
  const [progressStep, setProgressStep] = useState("Reading PDF structure...");
  const [resultData, setResultData] = useState(null);

  // Handle uploaded File selection
  const handleFileSelect = async (rawFile) => {
    setFileError(null);

    try {
      const parsed = await parsePdfMetadata(rawFile);
      setFile(parsed);
      setStage("workspace");
    } catch (err) {
      console.error("PDF Parsing Error:", err);
      if (err.message && err.message.toLowerCase().includes("encrypted")) {
        setFileError("This PDF is password-protected. Please unlock it using our Unlock PDF tool first.");
      } else {
        setFileError("We couldn't process this PDF. It may be corrupted, encrypted, or use an unsupported PDF structure.");
      }
    }
  };

  // Reset file and workspace
  const handleReset = () => {
    if (resultData && resultData.downloadUrl) {
      URL.revokeObjectURL(resultData.downloadUrl);
    }
    setFile(null);
    setFileError(null);
    setResultData(null);
    setStage("upload");
  };

  // Execute PDF Watermarking
  const handleExecuteWatermark = async (config) => {
    if (!file) return;

    setStage("processing");
    setProgressStep("Reading PDF structure...");

    try {
      const res = await executePdfWatermark({
        file,
        ...config,
        onProgress: (stepText) => setProgressStep(stepText)
      });

      setResultData(res);
      setStage("success");
    } catch (err) {
      console.error("Watermark PDF execution error:", err);
      setFileError(err.message || "An unexpected error occurred while watermarking PDF.");
      setStage("workspace");
    }
  };

  return (
    <ToolLayout
      title="Watermark PDF Online Free"
      subtitle="Stamp custom text or logo image watermarks onto PDF pages online. 100% client-side privacy with zero quality loss."
      currentSlug="watermark-pdf"
    >
      <div className="space-y-12">
        
        {/* Interactive Workspace Area */}
        {stage === "upload" && (
          <UploadState
            onFileSelected={handleFileSelect}
            error={fileError}
          />
        )}

        {stage === "workspace" && file && (
          <WatermarkWorkspace
            file={file}
            onResetFile={handleReset}
            onExecuteWatermark={handleExecuteWatermark}
          />
        )}

        {stage === "processing" && (
          <ProcessingState stepText={progressStep} />
        )}

        {stage === "success" && resultData && (
          <WatermarkSuccess
            result={resultData}
            onReset={handleReset}
          />
        )}

        {/* SEO Educational Content */}
        <div className="pt-8 border-t border-slate-200/80">
          <WatermarkPdfEducationalContent />
        </div>

        {/* SEO FAQ Section */}
        <FAQSection faqs={faqs} />
      </div>
    </ToolLayout>
  );
}
