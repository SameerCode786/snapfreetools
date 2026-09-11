"use client";

import React, { useState } from "react";
import ToolLayout from "@/layouts/tool-layout";

import UploadState from "./components/UploadState";
import DeleteWorkspace from "./components/DeleteWorkspace";
import ProcessingState from "./components/ProcessingState";
import DeleteSuccess from "./components/DeleteSuccess";

import {
  parsePdfMetadata,
  renderPageThumbnailsBatch,
  executePdfDeletePages
} from "./utils/pdfDeleteEngine";

import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import DeletePdfEducationalContent from "./content/educationalContent";
import { DELETE_PDF_FAQS } from "./content/faqs";

export default function DeletePDFFeature({ faqs = DELETE_PDF_FAQS }) {
  // --- CORE STAGES ---
  const [stage, setStage] = useState("upload"); // 'upload' | 'workspace' | 'processing' | 'success'
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  // --- WORKSPACE STATES ---
  const [thumbnails, setThumbnails] = useState([]);
  const [markedIndices, setMarkedIndices] = useState([]); // Array of page indices marked for deletion

  // --- EXECUTION STATES ---
  const [progressStep, setProgressStep] = useState("Reading PDF structure...");
  const [resultData, setResultData] = useState(null);

  // Handle uploaded File selection
  const handleFileSelect = async (rawFile) => {
    setFileError(null);

    try {
      const parsed = await parsePdfMetadata(rawFile);
      setFile(parsed);
      setMarkedIndices([]);
      setStage("workspace");

      // Batch render page thumbnails asynchronously
      renderPageThumbnailsBatch(rawFile, 0.3, () => {}).then((thumbs) => {
        setThumbnails(thumbs);
      }).catch((err) => {
        console.warn("Thumbnail background rendering warning:", err);
      });

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
    setThumbnails([]);
    setMarkedIndices([]);
    setStage("upload");
  };

  // Toggle deletion state for a page index
  const handleToggleDeletePage = (pageIndex) => {
    setMarkedIndices((prev) =>
      prev.includes(pageIndex)
        ? prev.filter((idx) => idx !== pageIndex)
        : [...prev, pageIndex]
    );
  };

  // Select all pages for deletion
  const handleSelectAllForDeletion = () => {
    if (!file) return;
    const allIndices = Array.from({ length: file.pageCount }, (_, i) => i);
    setMarkedIndices(allIndices);
  };

  // Deselect all (keep all pages)
  const handleKeepAllPages = () => {
    setMarkedIndices([]);
  };

  // Execute Delete Pages
  const handleExecuteDelete = async () => {
    if (!file) return;

    if (markedIndices.length === 0) {
      setFileError("Please select at least one page to delete.");
      return;
    }

    if (markedIndices.length === file.pageCount) {
      setFileError("You must keep at least one page in the PDF.");
      return;
    }

    setStage("processing");
    setProgressStep("Reading PDF structure...");

    try {
      const res = await executePdfDeletePages({
        file,
        deletedIndices: markedIndices,
        onProgress: (stepText) => setProgressStep(stepText)
      });

      setResultData(res);
      setStage("success");
    } catch (err) {
      console.error("Delete PDF Pages execution error:", err);
      setFileError(err.message || "An unexpected error occurred while deleting PDF pages.");
      setStage("workspace");
    }
  };

  return (
    <ToolLayout
      title="Delete PDF Pages"
      subtitle="Remove unwanted pages from your PDF online for free. 100% client-side privacy with zero quality loss."
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
          <DeleteWorkspace
            file={file}
            thumbnails={thumbnails}
            markedIndices={markedIndices}
            onToggleDeletePage={handleToggleDeletePage}
            onSelectAllForDeletion={handleSelectAllForDeletion}
            onKeepAllPages={handleKeepAllPages}
            onResetFile={handleReset}
            onExecuteDelete={handleExecuteDelete}
          />
        )}

        {stage === "processing" && (
          <ProcessingState stepText={progressStep} />
        )}

        {stage === "success" && resultData && (
          <DeleteSuccess
            result={resultData}
            onReset={handleReset}
          />
        )}

        {/* SEO Educational & Informational Guide */}
        <div className="pt-8 border-t border-slate-200/80">
          <DeletePdfEducationalContent />
        </div>

        {/* SEO FAQ Section */}
        <FAQSection faqs={faqs} />
      </div>
    </ToolLayout>
  );
}
