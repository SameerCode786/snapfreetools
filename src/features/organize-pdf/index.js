"use client";

import React, { useState } from "react";
import ToolLayout from "@/layouts/tool-layout";

import UploadState from "./components/UploadState";
import OrganizeWorkspace from "./components/OrganizeWorkspace";
import ProcessingState from "./components/ProcessingState";
import OrganizeSuccess from "./components/OrganizeSuccess";

import {
  parsePdfMetadata,
  renderPageThumbnailsBatch,
  executePdfOrganize
} from "./utils/organizePdfEngine";

import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import OrganizePdfEducationalContent from "./content/educationalContent";
import { ORGANIZE_PDF_FAQS } from "./content/faqs";

export default function OrganizePDFFeature({ faqs = ORGANIZE_PDF_FAQS }) {
  // --- CORE STAGES ---
  const [stage, setStage] = useState("upload"); // 'upload' | 'workspace' | 'processing' | 'success'
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  // --- WORKSPACE STATES ---
  const [pageItems, setPageItems] = useState([]); // [{ id, originalPageNumber, originalIndex, rotation, thumbnailUrl }]
  const [initialOrder, setInitialOrder] = useState([]);

  // --- EXECUTION STATES ---
  const [progressStep, setProgressStep] = useState("Reading PDF structure...");
  const [resultData, setResultData] = useState(null);

  // Handle uploaded File selection
  const handleFileSelect = async (rawFile) => {
    setFileError(null);

    try {
      const parsed = await parsePdfMetadata(rawFile);
      setFile(parsed);
      setPageItems([]);
      setStage("workspace");

      // Batch render page thumbnails asynchronously
      renderPageThumbnailsBatch(rawFile, 0.3, () => {}).then((items) => {
        setPageItems(items);
        setInitialOrder(items);
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
    setPageItems([]);
    setInitialOrder([]);
    setStage("upload");
  };

  // Reset order to original 1, 2, 3... N
  const handleResetOrder = () => {
    if (initialOrder.length === 0) return;
    setPageItems([...initialOrder].map(item => ({ ...item, rotation: 0 })));
  };

  // Reverse page sequence
  const handleReverseOrder = () => {
    setPageItems((prev) => [...prev].reverse());
  };

  // Execute PDF Organization / Reordering
  const handleExecuteOrganize = async () => {
    if (!file) return;

    if (!pageItems || pageItems.length === 0) {
      setFileError("No pages available to organize.");
      return;
    }

    setStage("processing");
    setProgressStep("Reading PDF structure...");

    try {
      const res = await executePdfOrganize({
        file,
        pageItems,
        onProgress: (stepText) => setProgressStep(stepText)
      });

      setResultData(res);
      setStage("success");
    } catch (err) {
      console.error("Organize PDF Pages execution error:", err);
      setFileError(err.message || "An unexpected error occurred while organizing PDF pages.");
      setStage("workspace");
    }
  };

  return (
    <ToolLayout
      title="Organize & Reorder PDF Pages"
      subtitle="Reorder, sort, and arrange PDF pages visually online. 100% client-side privacy with zero quality loss."
      currentSlug="organize-pdf"
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
          <OrganizeWorkspace
            file={file}
            pageItems={pageItems}
            onUpdatePageItems={setPageItems}
            onResetOrder={handleResetOrder}
            onReverseOrder={handleReverseOrder}
            onResetFile={handleReset}
            onExecuteOrganize={handleExecuteOrganize}
          />
        )}

        {stage === "processing" && (
          <ProcessingState stepText={progressStep} />
        )}

        {stage === "success" && resultData && (
          <OrganizeSuccess
            result={resultData}
            onReset={handleReset}
          />
        )}

        {/* SEO Educational Content */}
        <div className="pt-8 border-t border-slate-200/80">
          <OrganizePdfEducationalContent />
        </div>

        {/* SEO FAQ Section */}
        <FAQSection faqs={faqs} />
      </div>
    </ToolLayout>
  );
}
