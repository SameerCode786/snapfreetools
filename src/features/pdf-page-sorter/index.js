"use client";

import React, { useState } from "react";
import ToolLayout from "@/layouts/tool-layout";

import UploadState from "./components/UploadState.js";
import PageSorterWorkspace from "./components/PageSorterWorkspace.js";
import ProcessingState from "./components/ProcessingState.js";
import PageSorterSuccess from "./components/PageSorterSuccess.js";

import { parsePdfMetadata } from "./utils/pdfPageSorterEngine.js";

import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import PdfPageSorterEducationalContent from "./content/educationalContent.js";
import { PDF_PAGE_SORTER_FAQS } from "./content/faqs.js";

export default function PdfPageSorterFeature({ faqs = PDF_PAGE_SORTER_FAQS }) {
  // Main stage machine: 'upload' | 'workspace' | 'processing' | 'success'
  const [stage, setStage] = useState("upload");
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  // Execution & Progress State
  const [progressStep, setProgressStep] = useState("Preparing document...");
  const [resultData, setResultData] = useState(null);

  // Handle uploaded File selection & initial metadata parsing
  const handleFileSelect = async (rawFile) => {
    setFileError(null);

    try {
      const parsed = await parsePdfMetadata(rawFile);
      if (parsed.pageCount === 0) {
        setFileError("This PDF appears to be empty or contains 0 pages.");
        return;
      }
      setFile({
        ...parsed,
        name: rawFile.name,
        size: rawFile.size,
        rawFile
      });
      setStage("workspace");
    } catch (err) {
      console.error("PDF Parsing Error:", err);
      if (err.code === "PASSWORD_PROTECTED" || (err.message && err.message.toLowerCase().includes("password"))) {
        setFileError("This PDF is password-protected. Please unlock it using our Unlock PDF tool first.");
      } else {
        setFileError("We couldn't process this PDF. It may be corrupted, encrypted, or use an unsupported structure.");
      }
    }
  };

  // Reset workspace & clean memory resources
  const handleReset = () => {
    if (resultData && resultData.downloadUrl) {
      try {
        URL.revokeObjectURL(resultData.downloadUrl);
      } catch (err) {}
    }
    setFile(null);
    setFileError(null);
    setResultData(null);
    setProgressStep("Preparing document...");
    setStage("upload");
  };

  // Handle Export Start
  const handleExportStart = (stepText = "Compiling custom PDF page order...") => {
    setProgressStep(stepText);
    setStage("processing");
  };

  // Handle Export Success
  const handleExportSuccess = (result) => {
    setResultData(result);
    setStage("success");
  };

  return (
    <ToolLayout
      title="PDF Page Sorter Free – Sort & Reorder PDF Pages"
      description="Sort and reorder PDF pages online for free. Visually drag, drop, and rearrange PDF page order directly in your browser with private client-side processing."
      currentSlug="pdf-page-sorter"
      seoContent={<PdfPageSorterEducationalContent />}
    >
      <div className="space-y-12">
        {/* Stage 1: Upload State */}
        {stage === "upload" && (
          <UploadState
            onFileSelected={handleFileSelect}
            error={fileError}
          />
        )}

        {/* Stage 2: Interactive Page Sorting Workspace */}
        {stage === "workspace" && file && (
          <PageSorterWorkspace
            file={file}
            onResetFile={handleReset}
            onExportStart={handleExportStart}
            onExportSuccess={handleExportSuccess}
          />
        )}

        {/* Stage 3: Processing Progress State */}
        {stage === "processing" && (
          <ProcessingState stepText={progressStep} />
        )}

        {/* Stage 4: Export Success & Download State */}
        {stage === "success" && resultData && (
          <PageSorterSuccess
            result={resultData}
            onReset={handleReset}
          />
        )}

        {/* FAQ Accordion Section */}
        <FAQSection faqs={faqs} />
      </div>
    </ToolLayout>
  );
}
