"use client";

import React, { useState, useEffect, useRef } from "react";
import ToolLayout from "@/layouts/tool-layout";
import UploadZone from "./components/UploadZone";
import RedactionWorkspace from "./components/RedactionWorkspace";
import ProcessingState from "./components/ProcessingState";
import RedactSuccess from "./components/RedactSuccess";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import RedactPdfEducationalContent from "./content/educationalContent";
import { REDACT_PDF_FAQS } from "./content/faqs";
import {
  readPdfInfo,
  redactPdf,
  getSafeRedactedFilename,
  PdfRedactError,
} from "./engine/pdfRedactor";

export default function RedactPdfFeature({ faqs = REDACT_PDF_FAQS }) {
  const [stage, setStage] = useState("upload"); // 'upload' | 'workspace' | 'processing' | 'success'
  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [redactions, setRedactions] = useState([]);
  const [progressStep, setProgressStep] = useState("Reading PDF structure...");
  const [resultData, setResultData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const downloadUrlRef = useRef(null);

  // Clean up created Blob URLs on unmount or reset
  useEffect(() => {
    return () => {
      if (downloadUrlRef.current) {
        URL.revokeObjectURL(downloadUrlRef.current);
      }
    };
  }, []);

  const handleFileSelected = async (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileError(null);
    setResultData(null);
    setRedactions([]);
    setIsProcessing(true);

    try {
      const info = await readPdfInfo(selectedFile);
      setFileInfo({
        name: selectedFile.name,
        byteSize: info.byteSize,
        pageCount: info.pageCount,
        pages: info.pages,
      });
      setStage("workspace");
    } catch (err) {
      console.error("PDF info inspection error:", err);
      if (err.code === "PASSWORD_PROTECTED") {
        setFileError({
          title: "Password Protected PDF",
          message: "This PDF document is password-protected. Please unlock the PDF before redacting content.",
        });
      } else if (err.code === "CORRUPTED_PDF") {
        setFileError({
          title: "Corrupted PDF Document",
          message: "We couldn't read this PDF structure. The file may be damaged or malformed.",
        });
      } else {
        setFileError({
          title: "File Reading Error",
          message: err.message || "Failed to inspect PDF document structure. Please select a valid PDF.",
        });
      }
      setStage("upload");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current);
      downloadUrlRef.current = null;
    }
    setFile(null);
    setFileInfo(null);
    setFileError(null);
    setRedactions([]);
    setResultData(null);
    setIsProcessing(false);
    setStage("upload");
  };

  const handleAddRedaction = (box) => {
    setRedactions((prev) => [...prev, box]);
  };

  const handleRemoveRedaction = (boxId) => {
    setRedactions((prev) => prev.filter((b) => b.id !== boxId));
  };

  const handleClearRedactions = () => {
    setRedactions([]);
  };

  const handleExecuteRedact = async () => {
    if (!file || redactions.length === 0) return;

    setStage("processing");
    setIsProcessing(true);
    setProgressStep("Reading PDF document structure...");

    try {
      const res = await redactPdf(file, redactions, {}, (stepText) => {
        setProgressStep(stepText);
      });

      // Create Blob and Object URL for download
      const blob = new Blob([res.pdfBytes], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);
      downloadUrlRef.current = downloadUrl;

      const safeFileName = getSafeRedactedFilename(file.name);

      setResultData({
        ...res,
        fileName: safeFileName,
        downloadUrl,
      });

      setStage("success");
    } catch (err) {
      console.error("Redact PDF execution error:", err);
      setFileError({
        title: "Redaction Failed",
        message: err.message || "An unexpected error occurred while redacting the PDF file.",
      });
      setStage("workspace");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Redact PDF Online"
      subtitle="Permanently remove and black out confidential text, numbers, and images from your PDF files. 100% private in-browser processing."
    >
      <div className="space-y-12">
        
        {stage === "upload" && (
          <UploadZone
            onFileSelected={handleFileSelected}
            error={fileError}
          />
        )}

        {stage === "workspace" && fileInfo && (
          <RedactionWorkspace
            fileInfo={fileInfo}
            redactions={redactions}
            onAddRedaction={handleAddRedaction}
            onRemoveRedaction={handleRemoveRedaction}
            onClearRedactions={handleClearRedactions}
            onApplyRedactions={handleExecuteRedact}
            onChangeFile={handleReset}
            isProcessing={isProcessing}
          />
        )}

        {stage === "processing" && (
          <ProcessingState stepText={progressStep} />
        )}

        {stage === "success" && resultData && (
          <RedactSuccess
            result={resultData}
            onReset={handleReset}
          />
        )}

        {/* Educational Content Section */}
        <div className="pt-8 border-t border-slate-200/80">
          <RedactPdfEducationalContent />
        </div>

        {/* FAQs Section */}
        <FAQSection faqs={faqs} />

      </div>
    </ToolLayout>
  );
}
