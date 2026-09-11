"use client";

import React, { useState } from "react";
import ToolLayout from "@/layouts/tool-layout";

import UploadState from "./components/UploadState";
import PageNumberWorkspace from "./components/PageNumberWorkspace";
import ProcessingState from "./components/ProcessingState";
import PageNumberSuccess from "./components/PageNumberSuccess";

import {
  parsePdfMetadata,
  executeAddPageNumbers,
  isPasswordProtectedError
} from "./utils/pageNumbersEngine";

import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import AddPageNumbersPdfEducationalContent from "./content/educationalContent";
import { ADD_PAGE_NUMBERS_FAQS } from "./content/faqs";

export default function AddPageNumbersPDFFeature({ faqs = ADD_PAGE_NUMBERS_FAQS }) {
  // --- CORE STAGES ---
  const [stage, setStage] = useState("upload"); // 'upload' | 'workspace' | 'processing' | 'success'
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [isPasswordError, setIsPasswordError] = useState(false);

  // --- EXECUTION STATES ---
  const [progressStep, setProgressStep] = useState("Reading PDF structure...");
  const [resultData, setResultData] = useState(null);

  // Handle uploaded File selection
  const handleFileSelect = async (rawFile) => {
    setFileError(null);
    setIsPasswordError(false);

    try {
      const parsed = await parsePdfMetadata(rawFile);
      setFile(parsed);
      setStage("workspace");
    } catch (err) {
      if (err.isPasswordProtected || isPasswordProtectedError(err)) {
        setIsPasswordError(true);
        setFileError("This PDF is password-protected. Please unlock it using our Unlock PDF tool first.");
      } else {
        console.error("PDF Parsing Error:", err);
        setIsPasswordError(false);
        setFileError("We couldn't process this PDF. It may be corrupted, invalid, or use an unsupported PDF structure.");
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
    setIsPasswordError(false);
    setResultData(null);
    setStage("upload");
  };

  // Execute PDF Page Numbering
  const handleExecutePageNumbers = async (config) => {
    if (!file) return;

    setStage("processing");
    setProgressStep("Reading PDF structure...");

    try {
      const res = await executeAddPageNumbers({
        file,
        ...config,
        onProgress: (stepText) => setProgressStep(stepText)
      });

      setResultData(res);
      setStage("success");
    } catch (err) {
      if (err.isPasswordProtected || isPasswordProtectedError(err)) {
        setIsPasswordError(true);
        setFileError("This PDF is password-protected. Please unlock it using our Unlock PDF tool first.");
      } else {
        console.error("Add Page Numbers execution error:", err);
        setIsPasswordError(false);
        setFileError(err.message || "An unexpected error occurred while adding page numbers.");
      }
      setStage("workspace");
    }
  };

  return (
    <ToolLayout
      title="Add Page Numbers to PDF Online Free"
      subtitle="Insert customizable page numbers, header/footer pagination, and Page X of Y formats directly into your PDF document. 100% client-side privacy."
      currentSlug="add-page-numbers-pdf"
    >
      <div className="space-y-12">
        {/* Interactive Workspace Area */}
        {stage === "upload" && (
          <UploadState
            onFileSelected={handleFileSelect}
            error={fileError}
            isPasswordError={isPasswordError}
          />
        )}

        {stage === "workspace" && file && (
          <PageNumberWorkspace
            file={file}
            onResetFile={handleReset}
            onExecuteAddPageNumbers={handleExecutePageNumbers}
            onExecutePageNumbers={handleExecutePageNumbers}
          />
        )}

        {stage === "processing" && (
          <ProcessingState stepText={progressStep} />
        )}

        {stage === "success" && resultData && (
          <PageNumberSuccess
            result={resultData}
            onReset={handleReset}
          />
        )}

        {/* SEO Educational Content */}
        <div className="pt-8 border-t border-slate-200/80">
          <AddPageNumbersPdfEducationalContent />
        </div>

        {/* SEO FAQ Section */}
        <FAQSection faqs={faqs} />
      </div>
    </ToolLayout>
  );
}
